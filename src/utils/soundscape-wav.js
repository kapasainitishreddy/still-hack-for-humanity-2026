const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function bytesToBase64(bytes) { let output=''; for (let i=0;i<bytes.length;i+=3){const a=bytes[i];const b=i+1<bytes.length?bytes[i+1]:0;const c=i+2<bytes.length?bytes[i+2]:0;const triplet=(a<<16)|(b<<8)|c;output+=BASE64_ALPHABET[(triplet>>>18)&63];output+=BASE64_ALPHABET[(triplet>>>12)&63];output+=i+1<bytes.length?BASE64_ALPHABET[(triplet>>>6)&63]:'=';output+=i+2<bytes.length?BASE64_ALPHABET[triplet&63]:'=';} return output; }
function writeAscii(view, offset, text) { for (let i=0;i<text.length;i+=1) view.setUint8(offset+i,text.charCodeAt(i)); }
function clamp(value,min,max){return Math.min(max,Math.max(min,value));}
function renderSample(kind,t,random,state){const white=(random()*2)-1;if(kind==='brown'){state.brown=(state.brown+(white*0.035))/1.035;return clamp(state.brown*2.2,-1,1)*0.26;}if(kind==='rain'){state.rainLow=(state.rainLow*0.92)+(white*0.08);const hiss=(white-state.rainLow)*0.12;const drop=random()>0.997?(0.16+(random()*0.16)):0;state.drop=Math.max(drop,state.drop*0.94);return clamp(hiss+state.drop,-0.42,0.42);}const carrier=Math.sin(2*Math.PI*432*t);const warmHarmonic=Math.sin(2*Math.PI*216*t)*0.25;const slowPulse=0.82+(Math.sin(2*Math.PI*0.5*t)*0.08);return (carrier+warmHarmonic)*0.15*slowPulse;}
function createSoundscapeWavBase64(kind, options={}){if(!['brown','rain','tone432'].includes(kind))throw new Error(`Unknown soundscape kind: ${kind}`);const sampleRate=Math.max(8000,Math.floor(options.sampleRate||16000));const durationSeconds=clamp(Number(options.durationSeconds||8),0.1,30);const seed=Number.isFinite(options.seed)?Number(options.seed):20260822;const sampleCount=Math.floor(sampleRate*durationSeconds);const dataBytes=sampleCount*2;const buffer=new ArrayBuffer(44+dataBytes);const view=new DataView(buffer);writeAscii(view,0,'RIFF');view.setUint32(4,36+dataBytes,true);writeAscii(view,8,'WAVE');writeAscii(view,12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeAscii(view,36,'data');view.setUint32(40,dataBytes,true);const random=mulberry32(seed);const state={brown:0,rainLow:0,drop:0};const fadeSamples=Math.min(Math.floor(sampleRate*0.08),Math.floor(sampleCount/4));for(let i=0;i<sampleCount;i+=1){const t=i/sampleRate;let sample=renderSample(kind,t,random,state);if(fadeSamples>0){if(i<fadeSamples)sample*=i/fadeSamples;if(i>=sampleCount-fadeSamples)sample*=(sampleCount-1-i)/fadeSamples;}const pcm=Math.round(clamp(sample,-1,1)*32767);view.setInt16(44+(i*2),pcm,true);}return bytesToBase64(new Uint8Array(buffer));}
module.exports={createSoundscapeWavBase64};
