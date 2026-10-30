"""Vetoriza o monograma da Patty (post 175: P branco + anjinho e rosa em traço preto sobre vinho)
-> assets/img/monograma.svg com dois caminhos: .m-p (letra e ponta de flecha) e .m-tr (traço)."""
import os, numpy as np, potrace
from PIL import Image, ImageFilter
AQUI = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(AQUI)
SRC = os.path.join(os.path.dirname(SITE), '_ref', 'ig', '175_0.jpg')
E = 4
im = Image.open(SRC).convert('RGB')
im = im.resize((im.width*E, im.height*E), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.4))
a = np.asarray(im).astype(int)
lum = a.mean(axis=2)
branco = lum > 175
preto = lum < 45

def caminho(mask):
    path = potrace.Bitmap(~mask).trace(turdsize=40, alphamax=1.0, opticurve=True, opttolerance=0.25)
    out = []
    for c in path:
        s = c.start_point; d = [f'M{s.x/E:.2f} {s.y/E:.2f}']
        for seg in c.segments:
            if seg.is_corner: d.append(f'L{seg.c.x/E:.2f} {seg.c.y/E:.2f}L{seg.end_point.x/E:.2f} {seg.end_point.y/E:.2f}')
            else: d.append(f'C{seg.c1.x/E:.2f} {seg.c1.y/E:.2f} {seg.c2.x/E:.2f} {seg.c2.y/E:.2f} {seg.end_point.x/E:.2f} {seg.end_point.y/E:.2f}')
        out.append(''.join(d) + 'Z')
    return ''.join(out)

def caixa(mask, pad=6):
    ys, xs = np.where(mask)
    x0, y0, x1, y1 = xs.min()/E - pad, ys.min()/E - pad, xs.max()/E + pad, ys.max()/E + pad
    return f'{x0:.0f} {y0:.0f} {x1-x0:.0f} {y1-y0:.0f}'

dp, dt = caminho(branco), caminho(preto)
IMG = os.path.join(SITE, 'assets', 'img')
NS = 'xmlns="http://www.w3.org/2000/svg"'
# completo com classes (para CSS inline), completo em osso + vinho, e só a letra (menu e favicon)
open(os.path.join(IMG, 'monograma.svg'), 'w').write(f'<svg {NS} viewBox="{caixa(branco | preto)}"><path class="m-p" fill-rule="evenodd" d="{dp}"/><path class="m-tr" fill-rule="evenodd" d="{dt}"/></svg>')
open(os.path.join(IMG, 'monograma-osso.svg'), 'w').write(f'<svg {NS} viewBox="{caixa(branco | preto)}"><path fill="#eee5da" fill-rule="evenodd" d="{dp}"/><path fill="#b8323c" fill-rule="evenodd" d="{dt}"/></svg>')
open(os.path.join(IMG, 'monograma-p.svg'), 'w').write(f'<svg {NS} viewBox="{caixa(branco)}"><path fill="#eee5da" fill-rule="evenodd" d="{dp}"/></svg>')
print('ok')
