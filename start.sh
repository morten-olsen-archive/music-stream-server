#!/bin/bash
ffmpeg -f alsa -ac 2 -i hw:1,0 -acodec libmp3lame -ar 44100 -timeout 2000 -f rtp rtp://239.1.1.1:1234?fifo_size=50000000 
