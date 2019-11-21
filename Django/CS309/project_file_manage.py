from django.http import FileResponse
from django.http import HttpResponse
from CompileLatex.get_pdf import compile_latex_to_pdf


def save_file(request):
    try:
        data = request.POST.get('data')
        file_name = request.POST.get('file_name')
        file = open('../ProjectFolder/' + file_name, 'w+')
        print()
        file.write(data)
        file.close()
        return HttpResponse('ok')
    except Exception:
        return HttpResponse('error')


def load_file(request):
    file_name = request.GET.get('file_name')
    try:
        with open('../ProjectFolder/' + file_name, 'r') as f:
            return HttpResponse(f.read())
    except Exception:
        return HttpResponse('fail')


def compile_pdf(request):
    compile_latex_to_pdf('../ProjectFolder/project.tex', 'pdflatex')
    file = open('../ProjectFolder/project.pdf', 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/pdf'
    response['Content-Disposition'] = 'filename="project.pdf"'
    return response


