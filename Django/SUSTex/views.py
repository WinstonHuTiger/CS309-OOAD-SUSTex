from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.http import HttpResponse
from SUSTex.models import User


# Create your views here.
def logout(request):
    auth.logout(request)
    return HttpResponse('Logout!')


@login_required(login_url='/login/github/')
def get_user_info(request):
    user = User.objects.get(id=request.user.id)
    return HttpResponse(user)

