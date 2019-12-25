from django.http import HttpResponse
from django.shortcuts import redirect
from SUSTex.models import User
from django.contrib import auth
import requests
from django.views.decorators.csrf import csrf_protect

LOGIN_SCOPE = 'read:user'
GITHUB_CLIENT_ID = '7fef2786398de055aad1'
GITHUB_CLIENT_SECRET = 'fd3779593cff4bb50ca16ea2815a4793ee539fca'
REDIRECT_URI = 'http://127.0.0.1:8000/login/github/complete'
GET_USER_INFO_API_URL = 'https://api.github.com/user?access_token='
LOGIN_API_URL = 'https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=%s' \
                % (GITHUB_CLIENT_ID, REDIRECT_URI, LOGIN_SCOPE)
TOKEN_API_URL = 'https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=' \
                % (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
REDIRECT_FRONT_URL = 'http://127.0.0.1:3000/#/workbench/login/'


def login(request):
    return redirect(to=LOGIN_API_URL, permanent=False)


def complete(request):
    code = request.GET.get('code')
    response = requests.get(TOKEN_API_URL + code)
    data = dict(_.split('=') for _ in response.text.split('&'))
    access_token = data.get('access_token')
    if access_token is None:
        return redirect(to=LOGIN_API_URL, permanent=False)
    user_info = requests.get(GET_USER_INFO_API_URL + access_token, timeout=5, verify=False).json()
    github_id = user_info.get('id')
    alias = user_info.get('login')
    avatar_url = user_info.get('avatar_url')
    db_response = User.objects.filter(github_id=github_id)
    user = None
    if db_response.count() == 0:
        user = User(github_id=github_id, alias=alias, avatar_url=avatar_url)
        user.generate_random_id()
        user.save()
        print("NONE, put it into DB")
    else:
        print('already exist')
    auth.login(request, User.objects.get(github_id=github_id))
    request.session.set_expiry(0)
    return redirect(to=REDIRECT_FRONT_URL, permanent=False)