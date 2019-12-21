from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from Utils.ot import TextOperation
import json


class AsyncConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.random_str = self.scope['url_route']['kwargs']['random_str']
        await self.channel_layer.group_add(
            self.random_str,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.random_str,
            self.channel_name
        )

    # # Receive message from WebSocket
    # async def receive(self, text_data=None, bytes_data=None):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #
    #     # 信息群发
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'system_message',
    #             'message': message
    #         }
    #     )

    async def websocket_receive(self, event):
        print("receive", event)
        front_text = event.get("text", None)

        if front_text is not None:
            front_text = eval(front_text)
            random_str = self.scope['url_route']['kwargs']['random_str']
            print("random_str", random_str)
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
            request_id = front_text['request-id']
            parent_version = front_text['parent-version']

            # final_msg = await self.return_current_doc(random_str, request_id, parent_version, op)
            await self.channel_layer.group_send(
                self.random_str,
                {
                    "type": "doc_operation",
                    "text": json.dumps({"version": 123,})
                })
            print(json.dumps({'version': '2131'}))

    async def doc_operation(self, event):
        print("doc operation", event)
        await self.send({
            "type": "websocket.send",
            "text": event['text']
        })

    # Receive message from room group
    async def system_message(self, event):
        print(event)
        message = event['message']

        # Send message to WebSocket单发消息
        await self.send(text_data=json.dumps({
            'message': message
        }))

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