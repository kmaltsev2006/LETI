#include <iostream>
#include <cmath>

int N = 0;
char *VAR = nullptr;

namespace mlta
{

void print()
{
    int log2_n = std::ceil(std::log2(N));
    
    for (int i = 0; i < N; ++i)
    {
        std::cout << i << ": ";

        for (int j = 0; j < log2_n; ++j)
        {
            int J = i * log2_n * log2_n + j * log2_n;
            int num = 0;
            for (int k = 0; k < log2_n; k++)
            {
                num += VAR[J + k] << k;
            }
            std::cout << num << " ";
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;
}


void build(char* varset, int n, int I)
{
    if (I == n)
    {
        print();
        return;
    }
    
    if (varset[I] >= 0)
    {
        VAR[I] = varset[I];
        build(varset, n, I + 1);
        return;
    }

    VAR[I] = 0;
    build(varset, n, I + 1);
        
    VAR[I] = 1;
    build(varset, n, I + 1);
}


void fun(char *varset, int size)
{
    build(varset, size, 0);
}

} // namespace mlta
