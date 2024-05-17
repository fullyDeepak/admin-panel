#!/bin/bash
set -e # exit when error
# for non interactive shell
HOME=$(sed -n "s/^$(whoami):[^:]*:[^:]*:[^:]*:[^:]*:\([^:]*\):[^:]*$/\1/p" /etc/passwd)
. $HOME/.bashrc
source $HOME/.bashrc

set -x

# change working directory to wherever this script is
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd $SCRIPT_DIR

# source .env
source .env

# check node version
# node --version
# pull
git pull
# install deps
pnpm install --frozen-lockfile
# build
pnpm run build
# restart on pm2
node restart_pm2.js
