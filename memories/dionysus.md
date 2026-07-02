---
id: dionysus
title: Dionysus station maintenance prompt
content: Operational constraints and maintenance rules for the dionysus old iMac Xubuntu media station.
importance: high
tags: setup, ubuntu, xubuntu, maintenance
---

You are working on `dionysus`, an old iMac repurposed as a lightweight media, note-taking and browsing station.

This machine must be treated as a constrained legacy system. Do not optimise for newest packages, newest kernels, newest desktop features or maximum performance. Optimise for stability, low heat, predictable boot behaviour and H.264 media playback.

## Machine identity

```text
Hostname: dionysus
IP address: 192.168.1.202
Role: lightweight media playback, note taking, web browsing
Desktop: Xubuntu / XFCE
User model: simple local station, automatic login intended
```

## Current known working state

```text
OS:             Xubuntu 22.04.5 LTS
Ubuntu base:    Ubuntu 22.04 LTS / Jammy Jellyfish
Kernel:         5.15.0-185-generic
Kernel policy:  stay on the 5.15 GA kernel line
GPU:            NVIDIA GeForce GTX 775M Mac Edition
GPU PCI ID:     10de:119d
Driver:         NVIDIA 390.157
Driver package: nvidia-driver-390
Active driver:  nvidia
Desktop:        XFCE
Video target:   H.264 / AVC / avc1
Known issue:    internal fan reports 0 RPM, assume fan is dead until physically repaired
Cooling:        external fans currently used
```

## Core rule

Do not change the working platform unless explicitly asked.

The stable platform is:

```text
Xubuntu 22.04 LTS + 5.15 GA kernel + NVIDIA 390 + XFCE + H.264 media
```

Avoid changes that pull the machine towards:

```text
newer Ubuntu release
newer HWE kernel
6.x kernel
newer NVIDIA driver branch
GNOME desktop
Wayland-specific assumptions
AV1/VP9 video playback
high-load media workloads
```

## Update policy

Normal package and security updates within Ubuntu 22.04 LTS are allowed.

Release upgrades are not allowed.

Do not recommend or run:

```bash
do-release-upgrade
```

Do not change `/etc/update-manager/release-upgrades` away from:

```ini
Prompt=never
```

Ubuntu Pro / ESM is acceptable for extending security coverage, but it must not be used as a reason to upgrade the distribution release.

Allowed:

```text
security updates within Jammy
normal apt updates within Jammy
Ubuntu Pro esm-infra
Ubuntu Pro esm-apps
5.15 GA kernel security updates
```

Not allowed unless explicitly requested:

```text
upgrade to Ubuntu 24.04
upgrade to Ubuntu 26.04
install HWE kernel stack
install linux-generic-hwe-22.04
install 5.19 or 6.x kernels
replace XFCE with GNOME
replace NVIDIA 390 with a newer driver without checking hardware support
```

## Kernel policy

Keep the GA kernel line.

Correct meta packages:

```bash
sudo apt install linux-generic linux-headers-generic
```

Do not hold `linux-generic`, `linux-image-generic` or `linux-headers-generic`, because this machine should still receive security updates inside the 5.15 kernel line.

Blocked kernel families:

```text
linux-generic-hwe-22.04
linux-image-generic-hwe-22.04
linux-headers-generic-hwe-22.04
linux-tools-generic-hwe-22.04
linux-hwe-*
linux-image-5.19.*
linux-headers-5.19.*
linux-modules-5.19.*
linux-modules-extra-5.19.*
linux-tools-5.19.*
linux-image-6.*
linux-headers-6.*
linux-modules-6.*
linux-modules-extra-6.*
linux-tools-6.*
```

Expected apt preferences file:

```text
/etc/apt/preferences.d/block-hwe-kernels
```

Expected content:

```text
Package: linux-generic-hwe-22.04 linux-image-generic-hwe-22.04 linux-headers-generic-hwe-22.04 linux-tools-generic-hwe-22.04 linux-hwe-*
Pin: version *
Pin-Priority: -1

Package: linux-image-5.19.* linux-headers-5.19.* linux-modules-5.19.* linux-modules-extra-5.19.* linux-tools-5.19.*
Pin: version *
Pin-Priority: -1

Package: linux-image-6.* linux-headers-6.* linux-modules-6.* linux-modules-extra-6.* linux-tools-6.*
Pin: version *
Pin-Priority: -1
```

Before applying upgrades, check kernel-related changes:

```bash
apt list --upgradable 2>/dev/null | grep --extended-regexp 'linux-(image|headers|modules|generic|hwe)' || true
```

Allowed examples:

```text
linux-generic
linux-headers-generic
linux-image-generic
linux-image-5.15.0-...-generic
linux-headers-5.15.0-...-generic
linux-modules-5.15.0-...-generic
linux-modules-extra-5.15.0-...-generic
```

Suspicious examples:

```text
linux-generic-hwe-22.04
linux-image-generic-hwe-22.04
linux-headers-generic-hwe-22.04
linux-image-6.x...
linux-modules-6.x...
linux-headers-6.x...
```

If suspicious packages appear, stop and inspect before continuing.

## APT source policy

`jammy-proposed` must remain disabled.

This machine should not use pre-release update pockets.

Check:

```bash
apt-cache policy | grep --ignore-case proposed || true
```

Expected result:

```text
# no output
```

If `jammy-proposed` appears, disable it through Software & Updates or by editing the relevant source file.

Use:

```bash
grep --recursive --line-number --ignore-case 'jammy-proposed' \
  /etc/apt/sources.list \
  /etc/apt/sources.list.d/ 2>/dev/null
```

## NVIDIA policy

The current GPU is:

```text
NVIDIA GeForce GTX 775M Mac Edition
PCI ID: 10de:119d
```

The current working driver is:

```text
nvidia-driver-390
NVIDIA 390.157
```

Do not replace it casually.

Before any GPU driver change, run:

```bash
lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
ubuntu-drivers devices
uname --kernel-release
nvidia-smi
```

Expected working result:

```text
Kernel: 5.15.0-...
Driver Version: 390.157
Kernel driver in use: nvidia
```

If `ubuntu-drivers devices` recommends a different branch on another machine, follow the hardware-specific recommendation. Some similar old iMacs may need `nvidia-driver-470` instead of `nvidia-driver-390`.

For this machine, keep `nvidia-driver-390` unless there is a clear, explicit maintenance reason to change it.

## Video policy

This computer is for simple media playback, not heavy transcoding or modern high-resolution codecs.

Prefer:

```text
H.264 / AVC / avc1
MP4 container
AAC audio
720p
1080p if thermals remain stable
30 fps
```

Avoid:

```text
AV1 / av01
VP9 / vp09
H.265 / HEVC / hvc1 / hev1
4K
60 fps
10-bit HDR
browser-based high-resolution playback
```

Preferred players:

```text
mpv
VLC
```

Recommended local playback:

```bash
mpv --hwdec=auto-safe /path/to/video.mp4
```

VLC should use:

```text
Tools -> Preferences -> Input / Codecs
Hardware-accelerated decoding: VDPAU video decoder
```

If VDPAU causes problems, use:

```text
Hardware-accelerated decoding: Automatic
```

Browser video should prefer H.264. Use `h264ify` or `enhanced-h264ify` and block:

```text
AV1
VP9
VP8 if needed
60fps if needed
```

On YouTube, verify with:

```text
Right click video -> Stats for nerds -> Codecs
```

Good:

```text
avc1
```

Bad for this machine:

```text
vp09
av01
```

Check downloaded video files with:

```bash
ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,codec_long_name,width,height,r_frame_rate -of default=noprint_wrappers=1 "video-file.mp4"
```

Good:

```text
codec_name=h264
```

Problematic:

```text
codec_name=vp9
codec_name=av1
codec_name=hevc
```

## Thermal policy

Assume the internal fan is dead until the chassis is opened and the hardware is inspected.

Known fan behaviour:

```text
Apple SMC exposes fan controls.
fan1_input reports 0 RPM.
fan1_output can be set high.
RPM remains 0.
```

This means the fan is likely physically dead, disconnected, blocked or has a broken tach/control line.

Do not recommend heavy workloads until the fan issue is resolved.

Monitor temperatures with:

```bash
watch --interval 2 'sensors | grep --ignore-case --extended-regexp "Package|Core|Main|TG0|TC0"; echo; nvidia-smi'
```

Stop playback or reduce load if CPU/GPU temperatures climb into the high 80s or 90s Celsius.

External fan arrangement:

```text
Use external airflow through the chassis.
Push cool air toward lower/back intake areas.
Pull warm air away from upper rear exhaust.
Do not fight the intended airflow path.
```

## CPU power policy

Thermal management is preferred over peak responsiveness.

Installed/expected packages:

```bash
sudo apt install thermald cpufrequtils
```

Expected service:

```bash
sudo systemctl enable --now thermald
```

Expected CPU governor:

```text
powersave
```

Persistent config:

```text
/etc/default/cpufrequtils
```

Expected content:

```ini
GOVERNOR="powersave"
```

Check:

```bash
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

## Debugging policy

Use these commands before changing system state.

System identity:

```bash
hostname
ip addr
lsb_release --all
uname --kernel-release
```

Package health:

```bash
dpkg --audit
sudo apt update
sudo apt full-upgrade --simulate
```

Kernel state:

```bash
uname --kernel-release
dpkg --list | grep --extended-regexp 'linux-(image|headers|modules|generic|hwe)' || true
```

GPU state:

```bash
nvidia-smi
lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
ubuntu-drivers devices
```

Boot warnings:

```bash
journalctl --boot --dmesg --priority=warning..alert --no-pager
```

Errors only:

```bash
journalctl --boot --dmesg --priority=err..alert --no-pager
```

Previous boot:

```bash
journalctl --boot=-1 --dmesg --priority=warning..alert --no-pager
```

Sensor/fan state:

```bash
sensors
cat /sys/devices/platform/applesmc.768/fan1_input
cat /sys/devices/platform/applesmc.768/fan1_output
cat /sys/devices/platform/applesmc.768/fan1_manual
```

## Expected harmless warnings

On this old Apple hardware, these may appear and are usually not blockers:

```text
ACPI BIOS Warning
ACPI Error around _PDC
Corrupted DMI table
apple-properties device path parse error
ACPI SystemIO range conflicts
nvidia module taints kernel
NVRM loading NVIDIA UNIX kernel module
applesmc deprecated hwmon message
```

Do not chase these unless there is a matching symptom such as failed boot, failed suspend/resume, missing storage, missing Wi-Fi, missing display, repeated crashes or thermal shutdown.

## Wi-Fi note

If Wi-Fi is broken, check the Broadcom adapter:

```bash
lspci -nnk | grep --after-context=5 --ignore-case 'network\|wireless\|broadcom'
```

The Broadcom BCM4360 usually needs:

```bash
sudo apt install bcmwl-kernel-source
sudo reboot
```

Do not confuse failed `b43` probing messages with a general system failure. They may simply mean the wrong open driver cannot handle this Broadcom chip.

## Automatic login

This station is intended to be simple and appliance-like. Automatic login is acceptable for this machine if the physical environment is trusted.

Do not disable automatic login unless explicitly asked.

If changing display manager settings, preserve:

```text
simple local boot
automatic login
XFCE session
no extra desktop environment
```

## Operational checklist before making changes

Before installing, removing or upgrading anything, answer these questions:

```text
Will this pull in HWE or 6.x kernels?
Will this replace NVIDIA 390?
Will this require a newer Ubuntu release?
Will this increase idle CPU/GPU load?
Will this make browser video prefer AV1/VP9?
Will this break automatic login or XFCE?
Will this reduce stability for a simple media station?
```

If any answer is yes or unclear, stop and explain the risk before proceeding.

## Summary rule

Preserve this state:

```text
dionysus = old iMac media station
Xubuntu 22.04 LTS only
5.15 GA kernel line only
NVIDIA 390 only
XFCE only
H.264 video only where practical
no release upgrades
no jammy-proposed
no HWE kernels
security updates within Jammy allowed
simple local use with automatic login
thermal caution because internal fan reports 0 RPM
```
