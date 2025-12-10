#include <bdd.h>
#include <iostream>

#include "Solution.hpp"
#include "LimitationManager.hpp"

int main()
{
    mlta::Solution solution(9, 4);
    solution.solve();
}