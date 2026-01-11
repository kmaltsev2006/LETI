#pragma once

#include <stdio.h>
#include <assert.h>
#include <iostream>

#define T_SIZE 32 // max 32 for 1024 threads

#define CUDA_CHECK(err) {if (cudaSuccess != err){printf("%s in %s at line %d \n", cudaGetErrorString(err), __FILE__, __LINE__);exit(EXIT_FAILURE);}}

__global__ void tiled_mat_mul_kernel(float *A, float *B, float *C, int N, int M, int K)
{
    assert(T_SIZE == blockDim.x);
    assert(T_SIZE == blockDim.y);
    
    int by = blockIdx.y;
    int bx = blockIdx.x; 

    int ty = threadIdx.y;
    int tx = threadIdx.x; 

    int i = T_SIZE*by + ty;
    int j = T_SIZE*bx + tx;

    __shared__ float sh_A[T_SIZE * T_SIZE];
    __shared__ float sh_B[T_SIZE * T_SIZE];

    float value = 0;
    for (int phase = 0; phase < M / T_SIZE; ++phase)
    {
        if (i < N && phase * T_SIZE + tx < M)
            sh_A[ty * T_SIZE + tx] = A[(i)*M + phase*T_SIZE+tx];
        else
            sh_A[ty * T_SIZE + tx] = 0.0f;

        if (phase * T_SIZE + ty < M && j < K)
            sh_B[ty * T_SIZE + tx] = B[(phase*T_SIZE + ty)*K+j];
        else
            sh_B[ty * T_SIZE + tx] = 0.0f;
        __syncthreads();

        for (int k = 0; k < T_SIZE; ++k)
            value += sh_A[ty * T_SIZE + k] * sh_B[k * T_SIZE + tx];
        __syncthreads();
    }
    
    if ((i < N) && (j < K))
        C[i*K+j] = value;
}

void multiply_parallel(float *A, float *B, float *C, int N, int M, int K)
{
    int max_dim = std::max(N, std::max(M, K));
    
    int new_size = 1;
    while (new_size < max_dim || new_size % T_SIZE != 0) {
        new_size <<= 1;
    }
    
    float *A_padded = (float *)calloc(new_size * new_size, sizeof(float));
    float *B_padded = (float *)calloc(new_size * new_size, sizeof(float));
    float *C_padded = (float *)calloc(new_size * new_size, sizeof(float));

    for (int i = 0; i < N; i++) {
        memcpy(&A_padded[i * new_size], &A[i * M], M * sizeof(float));
    }

    for (int i = 0; i < M; i++) {
        memcpy(&B_padded[i * new_size], &B[i * K], K * sizeof(float));
    }

    float *d_A, *d_B, *d_C;
    size_t full_bytes = new_size * new_size * sizeof(float);
    
    CUDA_CHECK(cudaMalloc((void **)&d_A, full_bytes));
    CUDA_CHECK(cudaMalloc((void **)&d_B, full_bytes));
    CUDA_CHECK(cudaMalloc((void **)&d_C, full_bytes));
    
    CUDA_CHECK(cudaMemcpy(d_A, A_padded, full_bytes, cudaMemcpyHostToDevice));
    CUDA_CHECK(cudaMemcpy(d_B, B_padded, full_bytes, cudaMemcpyHostToDevice));
    
    dim3 dim_block(T_SIZE, T_SIZE, 1);
    dim3 dim_grid(new_size / T_SIZE, new_size / T_SIZE, 1);
    
    tiled_mat_mul_kernel<<<dim_grid, dim_block>>>(d_A, d_B, d_C, new_size, new_size, new_size);
    
    CUDA_CHECK(cudaMemcpy(C_padded, d_C, full_bytes, cudaMemcpyDeviceToHost));
    
    for (int i = 0; i < N; i++) {
        memcpy(&C[i * K], &C_padded[i * new_size], K * sizeof(float));
    }
    
    CUDA_CHECK(cudaFree(d_A));
    CUDA_CHECK(cudaFree(d_B));
    CUDA_CHECK(cudaFree(d_C));
    free(A_padded);
    free(B_padded);
    free(C_padded);
}

void deviceProperties()
{
    cudaDeviceProp dev_prop;
    cudaGetDeviceProperties(&dev_prop, 0);
    printf("Available Shared Memory per Block: %lu B \n", dev_prop.sharedMemPerBlock);
    printf("Max Threads per Block: %i \n", dev_prop.maxThreadsPerBlock);
}