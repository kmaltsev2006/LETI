#!/bin/bash

set -e

git clone https://github.com/boostorg/boost.git -b boost-1.89.0 boost_1_89_0 --depth 1
cd boost_1_89_0
git submodule update --depth 1 -q --init tools/boostdep
git submodule update --depth 1 -q --init libs/asio
python3 tools/boostdep/depinst/depinst.py -X test -g "--depth 1" asio

./bootstrap.sh
./b2
