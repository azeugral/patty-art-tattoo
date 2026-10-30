"""Gera as imagens do site a partir do Instagram extraído (_ref/ig) e o assets/js/obras.js.
Recorte 4:5 centrado (foco vertical ajustável por item), WebP em 640 e 1080 (ou o máximo da origem).
Uso: python tools/processar.py"""
import os, json
from PIL import Image, ImageEnhance

AQUI = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(AQUI)
IG = os.path.join(os.path.dirname(SITE), '_ref', 'ig')
IMG = os.path.join(SITE, 'assets', 'img')

def abrir(n):
    return Image.open(os.path.join(IG, n + '.jpg')).convert('RGB')

def recorte(im, prop=1.25, fy=.5, fx=.5):
    w, h = im.size
    if h / w > prop: cw, ch = w, round(w * prop)
    else: cw, ch = round(h / prop), h
    x = round((w - cw) * fx); y = round((h - ch) * fy)
    return im.crop((x, y, x + cw, y + ch))

def salvar(im, pasta, nome, larguras=(640, 1080), q=80):
    os.makedirs(os.path.join(IMG, pasta), exist_ok=True)
    feitos = []
    for L in larguras:
        L2 = min(L, im.width)
        if feitos and L2 == feitos[-1]: continue
        r = im.resize((L2, round(im.height * L2 / im.width)), Image.LANCZOS) if L2 < im.width else im
        r.save(os.path.join(IMG, pasta, f'{nome}-{L}.webp'), 'WEBP', quality=q, method=6)
        feitos.append(L2)
    return feitos

# portfólio: id, categoria, legenda, foco vertical
OBRAS = [
    ('022_0', 'real', 'Kali, realismo preto e cinza', .35),
    ('094_0', 'real', 'Leão, realismo', .5),
    ('009_0', 'fine', 'Floral fine line na costela', .4),
    ('184_0', 'pets', 'Retrato pet com nome', .5),
    ('035_0', 'real', 'Medusa, realismo', .35),
    ('051_0', 'fine', 'Olho com raios e frase', .4),
    ('164_0', 'real', 'Olho em realismo colorido', .5),
    ('061_0', 'cob', 'Cobertura: antes e depois do leão', .5),
    ('114_0', 'real', 'Rosto feminino em realismo', .45),
    ('065_0', 'fine', 'Flores em vermelho, traço autoral', .3),
    ('199_0', 'pets', 'Homenagem à Mel', .5),
    ('107_0', 'real', 'Caveira, realismo', .45),
    ('027_1', 'fine', 'Leoa com filhotes e flores', .5),
    ('149_0', 'real', 'Lobo, fechamento de canela', .45),
    ('313_0', 'cob', 'Cobertura floral sobre tatuagem antiga', .5),
    ('298_0', 'real', 'Olho e rosa em fechamento', .5),
    ('126_0', 'fine', 'Floral delicado no ombro', .4),
    ('203_0', 'real', 'Rosto em realismo no braço', .5),
    ('004_0', 'pets', 'Bartolomeu, 13 anos de histórias', .5),
    ('142_0', 'fine', 'Serpente e flores na coxa', .3),
    ('125_0', 'cob', 'Cobertura de tatuagem escura', .45),
    ('291_0', 'real', 'Leão com rosa', .5),
    ('027_7', 'fine', 'Árvore, mar e montanha em linha fina', .5),
    ('306_0', 'cob', 'Cobertura floral com homenagem', .5),
    ('151_0', 'real', 'Leão, fechamento de braço', .45),
    ('158_0', 'fine', 'Ramos finos na mão', .5),
    ('214_0', 'real', 'Leão com flores', .5),
    ('027_9', 'fine', 'Borboleta "Caos"', .5),
]

# pets ao lado da própria tatuagem (carrossel do post 017)
PETS = [('017_1', 'Buldogue francês'), ('017_3', 'Gato laranja'), ('017_11', 'Gato preto'), ('017_14', 'Spitz'),
        ('017_9', 'Vira-lata caramelo'), ('017_5', 'Bull terrier'), ('017_15', 'Pinscher'), ('017_12', 'Vira-lata'),
        ('017_7', 'Akita'), ('017_13', 'Labrador filhote')]

def main():
    obras = []
    for n, cat, leg, fy in OBRAS:
        im = recorte(abrir(n), 1.25, fy)
        ws = salvar(im, 'obras', n)
        obras.append({'id': n, 'c': cat, 'a': leg, 'w': ws[-1]})
    with open(os.path.join(SITE, 'assets', 'js', 'obras.js'), 'w', encoding='utf-8') as f:
        f.write('/* gerado por tools/processar.py */\nwindow.OBRAS = ' + json.dumps(obras, ensure_ascii=False) + ';\n')

    for n, _ in PETS:
        salvar(recorte(abrir(n), 1.25, .5), 'pets', n, (480, 800))

    # hero: retrato do post fixado (001_0), só a parte de cima (a frase gravada fica embaixo)
    r = abrir('001_0')
    topo = r.crop((0, 0, 1440, 950))
    topo = ImageEnhance.Color(topo).enhance(.9)
    salvar(topo, 'hero', 'patty', (960, 1440), q=82)
    cel = r.crop((210, 0, 1230, 950))
    cel = ImageEnhance.Color(cel).enhance(.9)
    salvar(cel, 'hero', 'patty-cel', (720, 1020), q=80)

    # a artista, o estúdio e a experiência
    for n, fy in [('001_3', .5), ('001_7', .4), ('001_5', .3), ('001_1', .5), ('029_0', .4)]:
        salvar(recorte(abrir(n), 1.25, fy), 'artista', n, (640, 1080))
    for n, fy in [('029_1', .5), ('029_2', .5), ('029_3', .5), ('029_5', .5), ('029_6', .5), ('040_15', .5)]:
        salvar(recorte(abrir(n), 1.25, fy), 'estudio', n, (640, 1080))

    # og: monograma + retrato (gerado em tools/gerar_og.py)
    print(len(obras), 'obras')

if __name__ == '__main__':
    main()
