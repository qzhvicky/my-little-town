# Regenerate files.json (the offline pack list). Run after changing any game file:  python3 tools_make_files.py
import os,hashlib,json,time
skip={'.git','.github'}; out=[]
for root,ds,fs in os.walk('.'):
    ds[:]=[d for d in sorted(ds) if d not in skip]
    for f in sorted(fs):
        p=os.path.join(root,f)[2:]
        if f.startswith('.') or p in ('files.json','tools_make_files.py','README.md','CNAME','sw.js') or p.endswith('.md') and p!='index.md': continue
        b=open(p,'rb').read(); out.append({'p':p,'s':len(b),'h':hashlib.md5(b).hexdigest()[:10]})
ver=hashlib.md5(''.join(x['h'] for x in out).encode()).hexdigest()[:10]
json.dump({'ver':ver,'built':time.strftime('%Y-%m-%d'),'files':out},open('files.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(out),'files',round(sum(x['s'] for x in out)/1e6,1),'MB ver',ver)
