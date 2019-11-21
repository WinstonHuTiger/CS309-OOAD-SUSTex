import subprocess


def compile_latex_to_pdf(file_path, mode):
    r = ""
    try:
        cmd = ['pdflatex', '-quiet', file_path, '-output-directory=../ProjectFolder']
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        content = p.stdout.read().decode('utf8')
        lines = content.split('\r\n')
    except Exception:
        print("Compile fail")
    errors = []
    for line in lines:
        if line == "":
            pass
        else:
            errors.append(line[line.rfind('/') + 1:])
            print(line[line.rfind('/') + 1:])
    return errors


if __name__ == '__main__':
    errors = compile_latex_to_pdf('C:\\Users\\HolldEaN\\Desktop\\test.tex', 'pdflatex')
    print(errors)
