#pragma once

namespace mlta
{

enum class Splice : int
{
    kVertical,
    kHorizontal,
    kNone
};


int ceilLog2(int n)
{
    int pow = 1;
    while (pow < n)
    {
        pow <<= 1;
    }
    return pow;
}

int sqrt(int n)
{
    int pow = 1;
    while (pow * pow != n)
    {
        ++pow;
    }
    return pow;
}

} // namespace mlta
