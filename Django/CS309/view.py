from django.http import FileResponse


def file_down(request):
    file = open('C:\\Users\\HolldEaN\\PycharmProjects\\untitled\\CS309\\CompileLatex\\test.pdf','rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/pdf'
    response['Content-Disposition'] = 'filename="test.pdf"'
    return response