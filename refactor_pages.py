import os

pages = ['Sales.jsx', 'Forecast.jsx', 'Customers.jsx', 'Reports.jsx', 'Inventory.jsx']

for page in pages:
    filepath = os.path.join('frontend', 'src', 'pages', page)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        modified = False
        
        # Inject useDataset import if missing
        if 'useDataset' not in content:
            if 'import {' in content:
                # Add after the first import block or just at the top
                content = 'import { useDataset } from "../contexts/DatasetContext";\n' + content
                modified = True
        
        # Inject activeDataset into the component if missing
        component_name = page.replace('.jsx', '')
        if f'function {component_name}() {{' in content and 'const { activeDataset } = useDataset();' not in content:
            content = content.replace(f'function {component_name}() {{', f'function {component_name}() {{\n  const {{ activeDataset }} = useDataset();')
            modified = True
            
        # Update getSales()
        if 'getSales()' in content:
            content = content.replace('getSales()', 'getSales(activeDataset?.id)')
            modified = True
            
        # Update getForecast()
        if 'getForecast()' in content:
            content = content.replace('getForecast()', 'getForecast(activeDataset?.id)')
            modified = True
            
        # Update getChurn()
        if 'getChurn()' in content:
            content = content.replace('getChurn()', 'getChurn(activeDataset?.id)')
            modified = True
            
        # Update getRecommendations()
        if 'getRecommendations()' in content:
            content = content.replace('getRecommendations()', 'getRecommendations(activeDataset?.id)')
            modified = True
            
        # Update getMetrics()
        if 'getMetrics()' in content:
            content = content.replace('getMetrics()', 'getMetrics(activeDataset?.id)')
            modified = True
            
        # Add activeDataset?.id to useEffect dependencies if missing
        if 'useEffect(() => {' in content and 'loadData' in content:
            if '}, []);' in content:
                content = content.replace('}, []);', '}, [activeDataset?.id]);')
            if '}, [])' in content:
                content = content.replace('}, [])', '}, [activeDataset?.id])')
                modified = True
                
        # Some components use loadPageData() or fetchSales(), etc. Let's find dependency arrays
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.strip() == '}, []);':
                lines[i] = line.replace('}, []);', '}, [activeDataset?.id]);')
                modified = True
            elif line.strip() == '}, [])':
                lines[i] = line.replace('}, [])', '}, [activeDataset?.id])')
                modified = True
                
        content = '\n'.join(lines)
            
        if modified:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f'Updated {filepath}')
