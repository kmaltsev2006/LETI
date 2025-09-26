import json
from pprint import pprint
import plotly.express as px
import plotly.graph_objects as go


def main():
    with open('../benchmark.json') as f:
        data = json.load(f)

    pprint(data)
        
    x1 = []
    y1 = []
    for i in data['benchmarks']:
        if (i['name'].startswith('BenchmarkMatrixMultiplier/Multiply/')):
            x1.append( int(i['name'].split('/')[2]) )
            y1.append( float(i['real_time']) )
    
    
    x2 = []
    y2 = []
    for i in data['benchmarks']:
        if (i['name'].startswith('BenchmarkMatrixMultiplier/MultiplyConcurrently/')):
            x2.append( int(i['name'].split('/')[2]) )
            y2.append( float(i['real_time']) )
    
    single_thread_fig = px.line(x=x1, y=y1)
    multy_thread_fig = px.line(x=x2, y=y2)
    
    fig = go.Figure(data = single_thread_fig.data + multy_thread_fig.data)
    fig.show()
    
    
if __name__ == '__main__':
    main()