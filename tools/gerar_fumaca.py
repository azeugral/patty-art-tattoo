"""Renderiza a fumaça (assets/js/fumaca.js) quadro a quadro num Edge headless e gera os MP4 das
telas de toque: fumaca-hero-pe / fumaca-hero-deitado (lado esquerdo do topo) e fumaca-calma-pe /
fumaca-calma-deitado (seção Como agendar). O loop fecha sem emenda (fase 0 -> 2π).
Os valores de modo/força/ciclo têm que bater com os data-* das caixas .fumaca do index.html.
Uso: python tools/gerar_fumaca.py [nome ...]
fumaca-hero-celular sai invertida como fumaca-hero-celular-preta.mp4 (fumaça preta do hero no celular)."""
import os, sys, subprocess, base64
from playwright.sync_api import sync_playwright
import imageio_ffmpeg

AQUI = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(AQUI)
VID = os.path.join(SITE, 'assets', 'video')
FPS = 24
# nome, largura, altura, modo, força, ciclo em segundos
VERSOES = [
    ('fumaca-hero-pe', 720, 1560, 0, 1.6, 40),
    ('fumaca-hero-deitado', 1280, 720, 0, 1.6, 40),
    ('fumaca-calma-pe', 720, 1280, 1, .8, 64),
    ('fumaca-calma-deitado', 1280, 720, 1, .8, 64),
]

def renderizar(pg, nome, w, h, modo, forca, ciclo):
    q = FPS * ciclo
    mp4 = os.path.join(VID, nome + '.mp4')
    enc = subprocess.Popen([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an', mp4], stdin=subprocess.PIPE)
    pg.set_viewport_size({'width': w, 'height': h})
    pg.evaluate(f"""(() => {{ document.body.innerHTML = '<canvas id="c"></canvas>';
        window.T = fumacaGL(document.getElementById('c'), {{preserveDrawingBuffer: true, modo: {modo}, forca: {forca}}}); T.tamanho({w}, {h}); }})()""")
    for i in range(q):
        png = base64.b64decode(pg.evaluate(f"(T.desenhar({i / q * 6.283185307179586}), document.getElementById('c').toDataURL('image/png'))").split(',', 1)[1])
        enc.stdin.write(png)
    enc.stdin.close(); enc.wait()
    if modo == 2:
        # fumaça preta: fundo branco e fumaça escura, para o CSS somar com multiply. Faixa limitada
        # (16-235): o fundo tem que ser 235, que decodifica como branco puro, senão o multiply
        # escurece o topo inteiro. Espelhado (hflip): o canto mais carregado fica à esquerda
        preta = os.path.join(VID, nome + '-preta.mp4')
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error', '-i', mp4, '-vf', "hflip,format=yuv420p,lutyuv=y='clip(235-(val-16)*2.2,16,235)':u=128:v=128",
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an', preta], check=True)
        os.remove(mp4); mp4 = preta
    print(mp4, round(os.path.getsize(mp4) / 1e6, 2), 'MB', flush=True)

if __name__ == '__main__':
    so = set(sys.argv[1:])
    os.makedirs(VID, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel='msedge', args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page()
        pg.set_content('<body style="margin:0;background:#000"></body>')
        pg.add_script_tag(content=open(os.path.join(SITE, 'assets', 'js', 'fumaca.js'), encoding='utf-8').read())
        for v in VERSOES:
            if not so or v[0] in so: renderizar(pg, *v)
        b.close()
