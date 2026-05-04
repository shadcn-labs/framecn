---
name: video-analysis
description: Analyze video files using ffprobe, mp4dump, and jq. Use when investigating video samples, keyframes, MP4 box structure, codec info, packet timing, or debugging video playback issues.
---

# Video Analysis

Analyze MP4/video files using CLI tools. All commands output JSON for jq filtering.

## FFprobe Basics

### Format + Streams (most common)

```bash
ffprobe -v quiet -print_format json -show_format -show_streams FILE.mp4
```

Key fields: `.format.duration`, `.streams[].codec_name`, `.streams[].codec_type`

### Stream selection

```bash
-select_streams v:0   # first video stream
-select_streams a:0   # first audio stream
-select_streams v     # all video streams
```

## Packets (sample-level data)

```bash
ffprobe -v quiet -print_format json -show_packets FILE.mp4
```

Key fields: `.packets[].pts_time`, `.packets[].flags`, `.packets[].size`

Flag meanings: `K` = keyframe, `D` = discard, `_` = none

### Keyframe packets only

```bash
ffprobe -v quiet -print_format json -show_packets -select_streams v:0 FILE.mp4 | \
  jq '[.packets[] | select(.flags | test("K"))]'
```

### Count keyframes

```bash
ffprobe -v quiet -print_format json -show_packets -select_streams v:0 FILE.mp4 | \
  jq '[.packets[] | select(.flags | test("K"))] | length'
```

## Frames (decoded frame info)

```bash
ffprobe -v quiet -print_format json -show_frames FILE.mp4
```

Key fields: `.frames[].pict_type` (I/P/B), `.frames[].key_frame`, `.frames[].pts_time`

### Limit frame count (faster)

```bash
ffprobe -v quiet -print_format json -show_frames -read_intervals "%+#100" FILE.mp4
```

Reads first 100 frames only.

## Common Queries

### Duration

```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 FILE.mp4
```

### Frame count

```bash
ffprobe -v quiet -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 FILE.mp4
```

### Codec info

```bash
ffprobe -v quiet -print_format json -show_streams FILE.mp4 | \
  jq '.streams[] | {codec: .codec_name, type: .codec_type, profile: .profile}'
```

### Video dimensions

```bash
ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 FILE.mp4
```

### Sample rate / channels (audio)

```bash
ffprobe -v quiet -select_streams a:0 -show_entries stream=sample_rate,channels -of csv=p=0 FILE.mp4
```

## MP4 Box Structure (mp4dump)

```bash
mp4dump --format json FILE.mp4
```

### Key boxes

- `ftyp`: file type/brand
- `moov`: movie metadata (contains all track info)
- `mvhd`: movie header (duration, timescale)
- `trak`: track container
- `mdhd`: media header (per-track timescale/duration)
- `stbl`: sample table (stts, stss, stsz, stco)
- `stss`: sync sample table (keyframe positions)
- `moof`: movie fragment (fragmented MP4)
- `mdat`: media data

### Find specific box

```bash
mp4dump --format json FILE.mp4 | jq '.. | objects | select(.name == "mvhd")'
```

### Fragmented MP4 check

```bash
mp4dump --format json FILE.mp4 | jq '[.. | objects | select(.name == "moof")] | length'
```

Non-zero = fragmented.

## JQ Patterns

### Filter by field value

```bash
jq '.streams[] | select(.codec_type == "video")'
```

### Extract specific fields

```bash
jq '.streams[] | {codec: .codec_name, duration: .duration}'
```

### Count items

```bash
jq '.packets | length'
```

### First N items

```bash
jq '.packets[:10]'
```

### Sum values

```bash
jq '[.packets[].size | tonumber] | add'
```

## CSV Output (for scripting)

```bash
ffprobe -v quiet -select_streams v:0 -show_entries packet=pts_time,flags,size -of csv=p=0 FILE.mp4
```

Output: `0.000000,1263,K__` (one line per packet)

## Test Assets

Sample files in `elements/test-assets/`:
- `10s-bars.mp4` - 10s color bars with audio
- `frame-count.mp4` - frame counting test
- `bars-n-tone.mp4` - multi-track test
