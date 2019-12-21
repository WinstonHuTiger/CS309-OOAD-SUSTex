from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.db import transaction
from Utils.ot import TextOperation
from django.contrib.auth import get_user_model, SESSION_KEY
from SUSTex.models import Document, DocumentChange, User, Project
import json


class AsyncConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if 'session' not in self.scope or SESSION_KEY not in self.scope['session']:
            pass
        else:
            session = self.scope['session']
            # self.random_str = self.scope['url_route']['kwargs']['random_str']
            self.random_str = 'taeVJySpBUjKdl5OYAHEbgxcLDw8mf'
            self.user_id = get_user_model()._meta.pk.to_python(session[SESSION_KEY])
            await self.channel_layer.group_add(
                self.random_str,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.random_str,
                self.channel_name
            )
        except AttributeError:
            raise RuntimeError(
                "Invalid connection closed"
            )

    # Receive message from WebSocket
    # async def receive(self, text_data=None, bytes_data=None):
    #     text_data_json = json.loads(text_data)
    #     print("HERE")
    #     print(text_data_json)
    #     # front_text = text_data_json['text']
    #
    #     # 信息群发
    #     await self.channel_layer.group_send(
    #         self.random_str,
    #         {
    #             'type': "doc_operation",
    #             'text': json.dumps({"version": 123})
    #         }
    #     )

    async def websocket_receive(self, event):
        print("receive", event)
        front_text = event['text']

        if front_text is not None:
            front_text = json.loads(front_text)
            # doc = await self._doc_get_or_create(document_id)
            opdata = front_text['op']
            for i in opdata:
                if not isinstance(i, int) and not isinstance(i, str):
                    await self.channel_layer.group_send(
                        self.doc_id,
                        {
                            "type": "doc_operation",
                            "text": "invalid data"
                        })
            print(opdata)
            op = TextOperation(opdata)
            parent_version = front_text['parent-version']

            final_msg = await self.return_current_doc(self.random_str, parent_version, op)
            print(final_msg)
            await self.channel_layer.group_send(
                self.random_str,
                {
                    'type': "doc_operation",
                    'text': json.dumps(final_msg)
                }
            )

    async def doc_operation(self, event):
        await self.send(json.dumps({
            "type": "websocket.send",
            "text": event['text']
        }))

    # Receive message from room group
    async def system_message(self, event):
        print(event)
        message = event['message']

        # Send message to WebSocket单发消息
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def _doc_get_or_create(self, eid):
        doc = self.get_document(eid)
        return doc

    @database_sync_to_async
    def return_current_doc(self, random_str, parent_version, op):
        print("new operation is", op.ops)
        saved = False
        with transaction.atomic():
            project = Project.objects.get(random_str=random_str)
            doc = Document.objects.get(project=project)
            user = User.objects.get(id=self.user_id)
            try:
                # already submitted?
                print("PARENT_VERSION")
                print(parent_version)
                c = DocumentChange.objects.get(
                    document=doc,
                    user=user,
                    parent_version=parent_version)
            except DocumentChange.DoesNotExist:
                changes_since = DocumentChange.objects.filter(
                    document=doc,
                    user=user,
                    version__gt=parent_version,
                    version__lte=doc.version).order_by('version')
                for c in changes_since:
                    op2 = TextOperation(json.loads(c.data))
                    print("after json", json.loads(c.data))
                    try:
                        op, _ = TextOperation.transform(op, op2)
                    except:
                        return ('unable to transform against version %d' % c.version)
                try:
                    doc.content = op(doc.content)
                except Exception:
                    return {
                        "version": doc.version,
                        "unable to apply": op.ops,
                    }
                next_version = doc.version + 1
                print("saved version", next_version)
                c = DocumentChange(
                    document=doc,
                    version=next_version,
                    user=user,
                    parent_version=parent_version,
                    data=json.dumps(op.ops))
                print(op.ops)
                c.save()
                doc.version = next_version
                doc.save()
                saved = True
        if saved:
            event = c.get_dict()
            return event

        return {'version': c.version }


def send_group_msg(room_name, message):
    # 从Channels的外部发送消息给Channel
    """
    from assets import consumers
    consumers.send_group_msg('ITNest', {'content': '这台机器硬盘故障了', 'level': 1})
    consumers.send_group_msg('ITNest', {'content': '正在安装系统', 'level': 2})
    :param room_name:
    :param message:
    :return:
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'notice_{}'.format(room_name),  # 构造Channels组名称
        {
            "type": "system_message",
            "message": message,
        }
    )