#!/bin/bash
# Copy media with clean names into public/media and generate video posters
set -e
RAW=/home/z/my-project/media/raw
PUB=/home/z/my-project/public/media
mkdir -p "$PUB/images" "$PUB/videos"

# ---- Images (mindfully curated from VLM analysis) ----
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.41.jpeg"   "$PUB/images/hero-trophy.jpg"          # 9/10 trophy+medal portrait — HERO
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.20.jpeg"   "$PUB/images/golf-portrait.jpg"        # 9/10 golf hero portrait
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.21.jpeg"   "$PUB/images/golf-putt-action.jpg"     # 9/10 putting action
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.42_1.jpeg" "$PUB/images/team-tequilas-night.jpg"  # 8/10 Team Tequilas champions night
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.43_1.jpeg" "$PUB/images/basketball-cougars.jpg"   # 7/10 Cougars basketball trophy
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.42_2.jpeg" "$PUB/images/golf-course.jpg"          # 7/10 golf course w/ bag
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.44.jpeg"   "$PUB/images/community-kids.jpg"       # 8/10 with kids, Man City shirt
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.43.jpeg"   "$PUB/images/community-coaching.jpg"   # 6/10 coaching kid in park
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.15.jpeg"   "$PUB/images/work-saltenas-prep.jpg"   # 8/10 making saltenas w/ grandfather
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.15_1.jpeg" "$PUB/images/work-saltenas-family.jpg" # 8/10 folding saltenas w/ dad
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.16.jpeg"   "$PUB/images/work-dough.jpg"           # 7/10 rolling dough
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.18_1.jpeg" "$PUB/images/work-register.jpg"        # 9/10 at CAJA register
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.18_2.jpeg" "$PUB/images/work-counter.jpg"         # 8/10 counter landscape
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.19.jpeg"   "$PUB/images/work-service.jpg"         # 8/10 QR payment counter
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.42.jpeg"   "$PUB/images/work-pizza.jpg"           # 7/10 pizza kitchen
cp "$RAW/WhatsApp_Image_2026-10-22_at_23.56.43_2.jpeg" "$PUB/images/forman-summer.jpg"        # 6/10 Forman summer program
cp "$RAW/WhatsApp_Image_2026-10-26_at_22.47.44.jpeg"   "$PUB/images/holi-festival.jpg"        # 10/10 personality shot
cp "$RAW/WhatsApp_Image_2026-10-24_at_11.59.20_1.jpeg" "$PUB/images/golf-portrait-alt.jpg"    # 8/10 alt golf portrait

# ---- Videos ----
cp "$RAW/WhatsApp_Video_2026-10-24_at_12.00.16.mp4"    "$PUB/videos/golf-swing.mp4"           # 9/10 full swing — featured
cp "$RAW/WhatsApp_Video_2026-10-24_at_11.59.21_1.mp4"  "$PUB/videos/golf-putting.mp4"         # 7/10 putting
cp "$RAW/WhatsApp_Video_2026-10-22_at_23.56.41.mp4"    "$PUB/videos/golf-address.mp4"         # 6/10 address position (vertical)
cp "$RAW/WhatsApp_Video_2026-10-24_at_11.59.15.mp4"    "$PUB/videos/kitchen-prep.mp4"         # cooking prep
cp "$RAW/WhatsApp_Video_2026-10-24_at_11.59.22.mp4"    "$PUB/videos/serving-tray.mp4"         # carrying tray

# ---- Video posters ----
ffmpeg -y -v error -i "$PUB/videos/golf-swing.mp4"   -ss 00:00:02 -frames:v 1 -q:v 3 "$PUB/videos/golf-swing-poster.jpg"
ffmpeg -y -v error -i "$PUB/videos/golf-putting.mp4" -ss 00:00:01 -frames:v 1 -q:v 3 "$PUB/videos/golf-putting-poster.jpg"
ffmpeg -y -v error -i "$PUB/videos/golf-address.mp4" -ss 00:00:01 -frames:v 1 -q:v 3 "$PUB/videos/golf-address-poster.jpg"
ffmpeg -y -v error -i "$PUB/videos/kitchen-prep.mp4" -ss 00:00:01 -frames:v 1 -q:v 3 "$PUB/videos/kitchen-prep-poster.jpg"
ffmpeg -y -v error -i "$PUB/videos/serving-tray.mp4" -ss 00:00:02 -frames:v 1 -q:v 3 "$PUB/videos/serving-tray-poster.jpg"

echo "---- Images ----"
ls -la "$PUB/images/"
echo "---- Videos ----"
ls -la "$PUB/videos/"
