#pragma once

#include <iostream>
#include <cmath>

extern int N;
extern char *VAR;

namespace mlta
{

void print();

void build(char *varset, int n, int I);

void fun(char *varset, int size);

} // namespace mlta
