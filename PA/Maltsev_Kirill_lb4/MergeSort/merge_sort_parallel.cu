#pragma once

#include <cuda_runtime.h>
#include <device_launch_parameters.h>
#include <iostream>

namespace DnCpCUDA
{
    __device__ void quickSort(int* v, int l, int r) {
        if (l >= r) return;
        
        int pivot = v[l + (r - l) / 2];
        int i = l, j = r;
        
        while (i <= j) {
            while (v[i] < pivot) ++i;
            while (v[j] > pivot) --j;
            if (i <= j) {
                int temp = v[i];
                v[i] = v[j];
                v[j] = temp;
                ++i;
                --j;
            }
        }
        
        quickSort(v, l, j);
        quickSort(v, i, r);
    }

    __global__ void smallBlockSortKernel(int* v, int* ranges, int numRanges) {
        int idx = blockIdx.x * blockDim.x + threadIdx.x;
        if (idx >= numRanges) return;
        
        int l = ranges[idx * 2];
        int r = ranges[idx * 2 + 1];
        
        quickSort(v, l, r);
    }
    
    __global__ void mergeKernel(int* v, int* temp, int n, int currentSize)
    {
        int idx = threadIdx.x + blockIdx.x * blockDim.x;
        int segment = idx * currentSize * 2;
        
        if (segment >= n) return;
        
        int l = segment;
        int m = min(segment + currentSize - 1, n - 1);
        int r = min(segment + 2 * currentSize - 1, n - 1);
        
        int i = l;
        int j = m + 1;
        int k = l;
        
        while (i <= m && j <= r) {
            if (v[i] < v[j]) {
                temp[k++] = v[i++];
            } else {
                temp[k++] = v[j++];
            }
        }
        
        while (i <= m) {
            temp[k++] = v[i++];
        }
        
        while (j <= r) {
            temp[k++] = v[j++];
        }
    }
    
    void cudaMergeSort(int* v, int n)
    {
        int *d_v, *d_temp;
        
        cudaMalloc(&d_v, n * sizeof(int));
        cudaMalloc(&d_temp, n * sizeof(int));
        
        cudaMemcpy(d_v, v, n * sizeof(int), cudaMemcpyHostToDevice);
        
        int blockSize = min(1024, 256);
        int numSmallBlocks = (n + blockSize - 1) / blockSize;
        
        int* ranges = new int[numSmallBlocks * 2];
        for (int i = 0; i < numSmallBlocks; i++) {
            ranges[i * 2] = i * blockSize;
            ranges[i * 2 + 1] = min((i + 1) * blockSize - 1, n - 1);
        }
        
        int *d_ranges;
        cudaMalloc(&d_ranges, numSmallBlocks * 2 * sizeof(int));
        cudaMemcpy(d_ranges, ranges, numSmallBlocks * 2 * sizeof(int), cudaMemcpyHostToDevice);
        
        int blocksForSmall = (numSmallBlocks + 1024 - 1) / 1024;
        smallBlockSortKernel<<<blocksForSmall, 1024>>>(d_v, d_ranges, numSmallBlocks);
        cudaDeviceSynchronize();
        
        cudaFree(d_ranges);
        delete[] ranges;
        
        for (int currentSize = blockSize; currentSize < n; currentSize *= 2) {
            int numSegments = (n + 2 * currentSize - 1) / (2 * currentSize);
            
            int blocks = (numSegments + 1024 - 1) / 1024;
            mergeKernel<<<blocks, 1024>>>(d_v, d_temp, n, currentSize);
            cudaDeviceSynchronize();
            
            cudaMemcpy(d_v, d_temp, n * sizeof(int), cudaMemcpyDeviceToDevice);
        }
        
        cudaMemcpy(v, d_v, n * sizeof(int), cudaMemcpyDeviceToHost);
        
        cudaFree(d_v);
        cudaFree(d_temp);
    }

}

void mergeSort(int* v, int n)
{
    DnCpCUDA::cudaMergeSort(v, n);
}