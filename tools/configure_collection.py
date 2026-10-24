"""Connect the public participant site to an explicitly provided Google Form."""
import argparse
import hashlib
import json
import re
from pathlib import Path

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('config',type=Path)
args=p.parse_args()
collector=json.loads(args.config.read_text())
assert collector.get('type')=='google-forms','Expected a google-forms configuration'
assert re.fullmatch(r'https://docs\.google\.com/forms/d/(?:e/)?[\w-]+/viewform',collector.get('viewUrl','')),'Invalid Google Forms view URL'
assert all(re.fullmatch(r'entry\.\d+',collector.get('entries',{}).get(k,'')) for k in ('session','refocus','bokeh','feedback')),'Missing entry IDs'
root=Path(__file__).resolve().parents[1]
manifest=root/'docs/study.json'
config=json.loads(manifest.read_text())
config['collection']=collector
config.pop('protocolHash',None)
config['protocolHash']=hashlib.sha256(json.dumps(config,sort_keys=True,separators=(',',':')).encode()).hexdigest()
manifest.write_text(json.dumps(config,indent=2)+'\n')
print('Collector configured. Commit docs/study.json, then verify an actual test submission in the spreadsheet.')
