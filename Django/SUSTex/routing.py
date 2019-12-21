from django.conf.urls import url
from SUSTex.views import consumers

websocket_urlpatterns = [
    url(r'^project/(?P<random_str>[^/]+)/$', consumers.AsyncConsumer),
]