#!/bin/bash
avconv -f alsa -ac 2 -i hw:1,0 -acodec mp2  -f rtp rtp://239.1.1.1:1234
