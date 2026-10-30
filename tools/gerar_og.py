"""og.jpg (1200x630) e ícones: retrato do hero à direita, monograma e nome à esquerda. O WhatsApp
recorta o centro em quadrado, então o monograma fica perto do meio."""
import os
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(AQUI)
url = 'file:///' + SITE.replace(os.sep, '/') + '/'
HTML = f"""<html><head><style>
@font-face{{font-family:G;src:url('{url}assets/fontes/gilda-display-latin.woff2')}}
@font-face{{font-family:F;src:url('{url}assets/fontes/figtree-latin.woff2')}}
body{{margin:0;width:1200px;height:630px;background:#0c0a0a;position:relative;overflow:hidden;font-family:F;color:#eee5da}}
.f{{position:absolute;right:0;top:0;width:760px;height:630px;background:url('{url}assets/img/hero/patty-1440.webp') 50% 20%/cover;
-webkit-mask-image:linear-gradient(90deg,transparent,#000 45%)}}
.t{{position:absolute;left:70px;top:120px}}
.t img{{width:150px}} h1{{font:400 104px/0.95 G;margin:22px 0 0}} h2{{font:400 46px/1 G;color:#bdb1a6;margin:6px 0 0}}
p{{margin:26px 0 0;font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:#d4646c}}
</style></head><body><div class=f></div><div class=t><img src="{url}assets/img/monograma-osso.svg"><h1>Patty</h1><h2>Art Tattoo</h2><p>Joinville · SC</p></div></body></html>"""
ICO = f"""<html><body style="margin:0;width:180px;height:180px;background:#9b2730;display:grid;place-items:center"><img src="{url}assets/img/monograma-p.svg" style="height:120px"></body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge'); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    tmp = os.path.join(SITE, '_og.html')
    def abrir(html):
        open(tmp, 'w', encoding='utf-8').write(html); pg.goto(url + '_og.html'); pg.wait_for_timeout(700)
    abrir(HTML); pg.screenshot(path=os.path.join(SITE, 'og.jpg'), type='jpeg', quality=86)
    pg.set_viewport_size({'width': 180, 'height': 180}); abrir(ICO); os.remove(tmp)
    pg.screenshot(path=os.path.join(SITE, 'apple-touch-icon.png'))
    b.close()
from PIL import Image
Image.open(os.path.join(SITE, 'apple-touch-icon.png')).resize((32, 32), Image.LANCZOS).save(os.path.join(SITE, 'favicon-32.png'))
print('ok')
