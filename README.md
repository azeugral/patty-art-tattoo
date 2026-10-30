# Patty Art Tattoo

Site da tatuadora Patty Ribeiro (@pattyartetattoo), Joinville/SC, bairro América. Prévia: https://azeugral.github.io/patty-art-tattoo/ (com `noindex` até a aprovação).

## Estrutura

- `index.html`: página única. Seções: hero, manifesto, a artista (reel com a fala dela), estilos, trabalhos (filtros e tela cheia), pets, cicatrizes e coberturas, estúdio, como agendar (ficha que monta a mensagem do WhatsApp), dúvidas e contato.
- `assets/css/patty.css`: noite `#0c0a0a`, osso `#eee5da` e o vinho do monograma `#9b2730`. Fontes self-hosted: Gilda Display (títulos) e Figtree (texto).
- `assets/js/fumaca.js`: shader da fumaça (base do site do Zaparolli, recolorido em vinho). No desktop roda ao vivo em WebGL; nas telas de toque entram os MP4 de `assets/video/fumaca-*.mp4`.
- `assets/js/obras.js`: lista do portfólio, gerada por `tools/processar.py`.
- `assets/img/monograma*.svg`: o "P" com o anjinho e a rosa, vetorizado do post do Instagram por `tools/vetorizar.py`.

## Ferramentas

- `python tools/processar.py`: recorta (4:5) e gera os WebP das obras, dos pets, do hero, da artista e do estúdio a partir de `../_ref/ig`.
- `python tools/gerar_fumaca.py`: renderiza os MP4 da fumaça.
- `python tools/gerar_og.py`: gera `og.jpg`, o `apple-touch-icon.png` e o favicon.

## CONFIRMAR com a cliente

1. **Nome:** "Patty Ribeiro" foi tirado de uma arte antiga do feed. Confirmar como ela quer assinar.
2. **Endereço:** o site diz só "Joinville, bairro América" e que o endereço vai na confirmação. Confirmar se ela quer o endereço completo (prédio e sala) e um mapa.
3. **WhatsApp:** (47) 99930-8417 (o link da bio). Confirmar se ainda é a recepção que atende os orçamentos.
4. **Desde 2014:** "9 anos" em set/2023 e "mais de 12 anos como tatuadora" no reel da onça.
5. **Tattoo Show Joinville 2026:** ela aparece como "artista confirmada" na 11ª edição. Confirmar se quer manter.
6. **Textos de clientes:** as histórias do Pitoco e da onça foram resumidas das legendas dela. Confirmar a autorização dos clientes.
7. **Vídeos:** os reels "artista", "pitoco" e "onça" são do Instagram dela, em 540p. Se ela tiver os originais, trocar.
8. **Agenda:** o texto diz que a agenda abre por períodos. Confirmar se há data da próxima abertura para destacar.
9. **Domínio:** ainda não há. Quando houver, tirar o `noindex`, trocar `og:url`/`og:image` e criar `robots.txt`/`sitemap.xml`.

---

Site por [L R G Z](https://lrgz.com.br)
