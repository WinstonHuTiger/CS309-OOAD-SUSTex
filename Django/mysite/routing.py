from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from SUSTex.views.consumers import DocumentChange
application = ProtocolTypeRouter({

    # WebSocket chat handler
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                url(r'^file_edit/$', DocumentChange),
                url(r'^file_edit/(?P<document_id>[^/]+)$', DocumentChange),
            ])
        ))

    # Using the third-party project frequensgi, which provides an APRS protocol

})