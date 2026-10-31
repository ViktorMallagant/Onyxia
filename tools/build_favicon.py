"""Create conventional PNG and ICO variants of the faceted amethyst favicon.

The vector version (favicon.svg) remains the primary icon. These alternatives
support browsers that prefer a multi-resolution .ico or Apple touch icon.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
S = 8

def P(points):
    return [(round(x*S),round(y*S)) for x,y in points]

def main():
    img=Image.new("RGBA",(64*S,64*S),(0,0,0,0))
    d=ImageDraw.Draw(img)
    d.rounded_rectangle((0,0,64*S,64*S),radius=13*S,fill="#101D2A")
    d.polygon(P([(18,10),(45,10),(57,26),(32,55),(7,26)]),fill="#8550C6")
    d.polygon(P([(18,10),(23,26),(7,26)]),fill="#915DD4")
    d.polygon(P([(45,10),(41,26),(57,26)]),fill="#492083")
    d.polygon(P([(18,10),(45,10),(41,26),(23,26)]),fill="#CFA9FF")
    d.polygon(P([(7,26),(23,26),(32,55)]),fill="#7034B7")
    d.polygon(P([(57,26),(41,26),(32,55)]),fill="#4E238C")
    d.polygon(P([(23,26),(41,26),(32,55)]),fill="#AD6EEB")
    d.line(P([(18,10),(45,10),(57,26),(32,55),(7,26),(18,10)]),fill="#E7D0FF",width=2*S,joint="curve")
    d.line(P([(7,26),(57,26)]),fill="#D6ACFF",width=1*S)
    d.line(P([(23,26),(32,55),(41,26)]),fill="#DCC0FF",width=1*S)
    d.line(P([(18,10),(12,19)]),fill="#FFF0FF",width=2*S)
    resample=Image.Resampling.LANCZOS
    img.resize((180,180),resample).save(ROOT/"favicon.png",optimize=True)
    img.save(ROOT/"favicon.ico",format="ICO",sizes=[(16,16),(32,32),(48,48),(64,64)])
    print("Favicon variants prepared: SVG, 180px PNG and multi-size ICO.")

if __name__ == "__main__":
    main()
