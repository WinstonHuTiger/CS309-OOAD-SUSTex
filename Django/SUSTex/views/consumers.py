from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from SUSTex.models import Document


# def get_document(eid):
#
#     return doc


class DocumentChange(AsyncConsumer):
    async def websocket_connect(self, event):
        print("connected", event)
        await self.send({
            "type": "websocket.accept"
        })
        document_id = self.scope['url_route']['kwargs']['document_id']
        # self.doc_id = f"document_{document_id}"
        self.doc_id = "1"
        await self.channel_layer.group_add(
            self.doc_id,
            self.channel_name
        )

    async def websocket_receive(self, event):
        print("receive", event)
        # front_text = event.get("text", None)
        #
        # if front_text is not None:
        #     front_text = eval(front_text)
        #     document_id = self.scope['url_route']['kwargs']['document_id']
        #     print("document_id", document_id)
        #     # doc = await self._doc_get_or_create(document_id)
        #     opdata = front_text['op']
        #     for i in opdata:
        #         if not isinstance(i, int) and not isinstance(i, str):
        #             await self.channel_layer.group_send(
        #                 self.doc_id,
        #                 {
        #                     "type": "doc_operation",
        #                     "text": "invalid data"
        #                 })
        #     op = TextOperation(opdata)
        #     request_id = front_text['request-id']
        #     parent_version = front_text['parent-version']
        #
        #     final_msg = await self.return_current_doc(document_id, request_id, parent_version, op)
        #     await self.channel_layer.group_send(
        #         self.doc_id,
        #         {
        #             "type": "doc_operation",
        #             "text": json.dumps(final_msg)
        #         })
        await self.channel_layer.group_send(
            self.doc_id,
            {
                "type": "doc_operation",
                "text": "receive"
            })

    async def doc_operation(self, event):
        print("doc operation", event)
        await self.send({
            "type": "websocket.send",
            "text": event['text']
        })

    async def websocket_disconnect(self, event):
        print("disconnect", event)

    @database_sync_to_async
    def _doc_get_or_create(self, eid):
        doc = self.get_document(eid)
        return doc
    #
    # @database_sync_to_async
    # def return_current_doc(self, document_id, request_id, parent_version, op):
    #     print("new operation is", op.ops)
    #     saved = False
    #     eid = document_id
    #     with transaction.atomic():
    #
    #         doc = self.get_document(eid)
            # try:
            #     # already submitted?
            #     c = DocumentChange.objects.get(
            #         document=doc,
            #         request_id=request_id,
            #         parent_version=parent_version)
            # except DocumentChange.DoesNotExist:
            #
            #     changes_since = DocumentChange.objects.filter(
            #         document=doc,
            #         version__gt=parent_version,
            #         version__lte=doc.version).order_by('version')
            #
            #     for c in changes_since:
            #
            #         op2 = TextOperation(json.loads(c.data))
            #         print("after json", json.loads(c.data))
            #         try:
            #             op, _ = TextOperation.transform(op, op2)
            #         except:
            #             return ('unable to transform against version %d' % c.version)
            #
            # try:
            #     doc.content = op(doc.content)
            # except:
            #     return {
            #         "version": doc.version,
            #         "unable to apply": op.ops,
            #     }

    #         next_version = doc.version + 1
    #         print("saved version", next_version)
    #         c = DocumentChange(
    #             document=doc,
    #             version=next_version,
    #             request_id=request_id,
    #             parent_version=parent_version,
    #             data=json.dumps(op.ops))
    #         print(op.ops)
    #         c.save()
    #         doc.version = next_version
    #         doc.save()
    #         saved = True
    # if saved:
    #     event = c.export()
    #     return event
    #
    #     return {'version': c.version}

    def get_document(self, eid):
        # project_id = eid.split("_")[0]
        # file_name = eid.split("_")[-1]
        doc = Document.objects.get(id=1)
        # try:
        #     docs = Document.objects.filter(project_file=proj_.get_project_files_by_name(file_name)).order_by('-control_version')
        #     doc = [d for d in docs][0]
        # except:
        #     doc = Document(project_file=proj_.get_project_files_by_name(file_name))
        #     doc.save()
        return doc