from django.http import HttpResponse


def compile_latex(request):
    print(request.POST.get('username'))
    return HttpResponse("Compile latex pdf!")

