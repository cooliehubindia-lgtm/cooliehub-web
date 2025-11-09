\
import React, { useMemo, useState, useEffect } from "react";

const Field = ({ label, children, required }) => (
  <label className="block mb-3">
    <span className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500"> *</span>}
    </span>
    {children}
  </label>
);

const Card = ({ title, subtitle, children, footer }) => (
  <div className="rounded-2xl shadow-lg p-5 bg-white/90 backdrop-blur border border-gray-100">
    <div className="mb-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    <div>{children}</div>
    {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
  </div>
);

function useLocal(key, initial) {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function Receipt({ receipt, onClose }) {
  if (!receipt) return null;
  const { type, name, mobile, village, amount, date, receiptNo, extra } = receipt;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:bg-transparent">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 print:shadow-none print:border print:border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">COOLIEHUB FOUNDATION</h2>
            <p className="text-gray-600">కూలీల ఇన్సూరెన్స్ నమోదు సహాయక సేవా రసీదు</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-mono">Receipt No: {receiptNo}</p>
            <p className="font-mono">Date: {date}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><span className="text-gray-500">Name:</span> {name}</p>
          <p><span className="text-gray-500">Mobile:</span> {mobile}</p>
          <p><span className="text-gray-500">Village:</span> {village}</p>
          <p><span className="text-gray-500">Service:</span> {type}</p>
          {extra?.farmer && <p><span className="text-gray-500">Farmer Need:</span> {extra.farmer}</p>}
        </div>
        <div className="my-4 rounded-xl bg-gray-50 p-3 flex items-center justify-between">
          <span className="text-gray-700">Amount Received</span>
          <span className="text-2xl font-semibold">₹{amount}</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <p>ఈ రుసుము సేవా మరియు నమోదు సహాయం కోసం మాత్రమే. పని హామీ ఇవ్వబడదు.</p>
          <p>Insurance policy & benefits are governed by Government/Insurer rules. CoolieHub does not issue policies or compensation.</p>
        </div>
        <div className="mt-5 flex gap-2 print:hidden">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl border hover:bg-gray-50">Print / Save PDF</button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-black text-white">Close</button>
        </div>
      </div>
    </div>
  );
}

function NavTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base transition ${active ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [receipts, setReceipts] = useLocal("ch_receipts", []);
  const [show, setShow] = useState(null);

  const genReceiptNo = () => {
    const n = Math.floor(Math.random() * 900000 + 100000);
    return `CHF-${n}`;
  };

  const today = useMemo(
    () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }),
    []
  );

  // Forms state
  const [labour, setLabour] = useState({ name: "", mobile: "", village: "", aadhaar: "", agree: true });
  const [farmer, setFarmer] = useState({ name: "", mobile: "", village: "", need: "", date: "" });

  const addReceipt = (r) => {
    setReceipts((prev) => [r, ...prev]);
    setShow(r);
  };

  const simulatePayment = (amount) => new Promise((res) => setTimeout(res, 600));

  const submitLabour = async (e) => {
    e.preventDefault();
    await simulatePayment(150);
    const rec = {
      type: "Insurance Registration Assistance",
      name: labour.name,
      mobile: labour.mobile,
      village: labour.village,
      amount: 150,
      date: today,
      receiptNo: genReceiptNo(),
    };
    addReceipt(rec);
    setLabour({ name: "", mobile: "", village: "", aadhaar: "", agree: true });
    setTab("receipts");
  };

  const submitFarmer = async (e) => {
    e.preventDefault();
    await simulatePayment(0);
    const rec = {
      type: "Farmer Request Logged (No Fee)",
      name: farmer.name,
      mobile: farmer.mobile,
      village: farmer.village,
      amount: 0,
      date: today,
      receiptNo: genReceiptNo(),
      extra: { farmer: farmer.need }
    };
    addReceipt(rec);
    setFarmer({ name: "", mobile: "", village: "", need: "", date: "" });
    setTab("receipts");
  };

  const [theme, setTheme] = useState("green");
  const themeGrad = theme === "green" ? "from-green-600 via-green-500 to-emerald-500" :
                    theme === "blue" ? "from-blue-600 via-blue-500 to-sky-500" :
                    "from-amber-600 via-yellow-500 to-amber-400";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGrad} text-gray-900`}>
      <div className={`min-h-screen bg-gradient-to-br ${themeGrad} text-gray-900`}>
        <header className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white grid place-items-center font-bold">CH</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">CoolieHub Foundation</h1>
              <p className="text-xs sm:text-sm text-white/90">కూలీల గౌరవం – రైతుల బలం</p>
            </div>
          </div>
          <div className="flex gap-2">
            <NavTab active={tab === "home"} onClick={() => setTab("home")}>Home</NavTab>
            <NavTab active={tab === "farmer"} onClick={() => setTab("farmer")}>Farmer</NavTab>
            <NavTab active={tab === "labour"} onClick={() => setTab("labour")}>Worker</NavTab>
            <NavTab active={tab === "insurance"} onClick={() => setTab("insurance")}>Insurance</NavTab>
            <NavTab active={tab === "students"} onClick={() => setTab("students")}>Students</NavTab>
            <NavTab active={tab === "ideas"} onClick={() => setTab("ideas")}>నా యోచన</NavTab>
            <NavTab active={tab === "receipts"} onClick={() => setTab("receipts")}>Receipts</NavTab>
          </div>
        </header>

        {tab === "home" && (
          <main className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <Card
                title="మన ఊరి ఉపాధి – మన ఊరికే"
                subtitle="గ్రామంలోనే పని – సమయానికి పని ముగింపు – పారదర్శక రసీదులు"
              >
                <ul className="list-disc ml-5 space-y-2 text-gray-700">
                  <li>కూలీల ఇన్సూరెన్స్ నమోదు సహాయం (₹150 సేవా రుసుము)</li>
                  <li>రైతుల పని అభ్యర్థన – ఫిక్స్ టైమ్, ఫిక్స్ టీమ్</li>
                  <li>గుత్త పని (టీమ్ లీడర్/మేస్త్రి పాత్రతో)</li>
                  <li>విద్య & ఉద్యోగాలు (Students) – అలర్ట్స్/గైడెన్స్</li>
                  <li>ఆటోమేటిక్ రసీదు – PDF/ప్రింట్</li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => setTab("labour")} className="px-5 py-3 rounded-2xl bg-black text-white">నేను కూలీని</button>
                  <button onClick={() => setTab("farmer")} className="px-5 py-3 rounded-2xl border border-black/20 bg-white">నేను రైతుని</button>
                </div>
              </Card>

              <Card title="థీమ్ రంగు" subtitle="గ్రామీణ మిక్స్ UI — మీకు నచ్చిన రంగు ఎంచుకోండి">
                <div className="flex gap-3">
                  <button onClick={() => setTheme("green")} className={`px-4 py-2 rounded-xl ${theme === "green" ? "bg-black text-white" : "bg-white"}`}>పచ్చ</button>
                  <button onClick={() => setTheme("blue")} className={`px-4 py-2 rounded-xl ${theme === "blue" ? "bg-black text-white" : "bg-white"}`}>నీలం</button>
                  <button onClick={() => setTheme("amber")} className={`px-4 py-2 rounded-xl ${theme === "amber" ? "bg-black text-white" : "bg-white"}`}>పసుపు</button>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>ఈ డెమో లో డేటా మీ డివైస్‌లో (localStorage) మాత్రమే సేవ్ అవుతుంది.</p>
                  <p>లైవ్ వెర్షన్‌లో Razorpay/Cashfree జత చేసి పేమెంట్-ఆధారిత రసీదులు వస్తాయి.</p>
                </div>
              </Card>
            </div>
          </main>
        )}

        {tab === "labour" && (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Card title="కూలీ నమోదు (Insurance Registration Assistance)" subtitle="₹150 సేవా రుసుము – పేమెంట్ సక్సెస్ తర్వాత రసీదు ఆటోగా వస్తుంది">
              <form onSubmit={submitLabour} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="పేరు" required>
                  <input required value={labour.name} onChange={(e)=>setLabour({...labour, name:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="మీ పేరు"/>
                </Field>
                <Field label="మొబైల్" required>
                  <input required pattern="[0-9]{10}" value={labour.mobile} onChange={(e)=>setLabour({...labour, mobile:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="10 digit"/>
                </Field>
                <Field label="గ్రామం" required>
                  <input required value={labour.village} onChange={(e)=>setLabour({...labour, village:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="ఉదా: Mandoddi"/>
                </Field>
                <Field label="ఆధార్ (ఐచ్చికం)">
                  <input value={labour.aadhaar} onChange={(e)=>setLabour({...labour, aadhaar:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="1234-5678-9012"/>
                </Field>
                <div className="sm:col-span-2 flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={labour.agree} onChange={(e)=>setLabour({...labour, agree:e.target.checked})} className="mt-1"/>
                  <p>ఈ రుసుము సేవా మరియు నమోదు సహాయం కోసం మాత్రమే. పని హామీ ఇవ్వబడదు.</p>
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button disabled={!labour.name || !labour.mobile || !labour.village || !labour.agree} className="px-5 py-3 rounded-2xl bg-black text-white">Pay ₹150 & Get Receipt</button>
                  <button type="button" onClick={()=>setLabour({ name:"", mobile:"", village:"", aadhaar:"", agree:true })} className="px-5 py-3 rounded-2xl border">Reset</button>
                </div>
              </form>
            </Card>
          </main>
        )}

        {tab === "farmer" && (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Card title="రైతు పని అభ్యర్థన" subtitle="ఫ్రీ రిక్వెస్ట్ – టీమ్ మీతో సంప్రదిస్తుంది">
              <form onSubmit={submitFarmer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="పేరు" required>
                  <input required value={farmer.name} onChange={(e)=>setFarmer({...farmer, name:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="రైతు పేరు"/>
                </Field>
                <Field label="మొబైల్" required>
                  <input required pattern="[0-9]{10}" value={farmer.mobile} onChange={(e)=>setFarmer({...farmer, mobile:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="10 digit"/>
                </Field>
                <Field label="గ్రామం" required>
                  <input required value={farmer.village} onChange={(e)=>setFarmer({...farmer, village:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="ఉదా: Mandoddi"/>
                </Field>
                <Field label="అవసరం (ఎంత మంది, ఏ పని)" required>
                  <input required value={farmer.need} onChange={(e)=>setFarmer({...farmer, need:e.target.value})} className="w-full px-3 py-2 rounded-xl border" placeholder="ఉదా: 12 మంది నాటు పని రేపు"/>
                </Field>
                <div className="sm:col-span-2 flex gap-3">
                  <button className="px-5 py-3 rounded-2xl bg-black text-white">Submit Request</button>
                  <button type="button" onClick={()=>setFarmer({ name:"", mobile:"", village:"", need:"", date:"" })} className="px-5 py-3 rounded-2xl border">Reset</button>
                </div>
              </form>
            </Card>
          </main>
        )}

        {tab === "insurance" && (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Card title="ఇన్సూరెన్స్ సహాయం" subtitle="PMSBY/PMJJBY/ప్రైవేట్ పాలసీలు – నమోదు సహాయం, సపోర్ట్, రసీదు">
              <div className="space-y-3 text-gray-700">
                <p>✔️ ప్రభుత్వ పథకాలు & ప్రైవేట్ పాలసీ సమాచారం</p>
                <p>✔️ రిజిస్ట్రేషన్ సహాయం (₹150 సేవా రుసుము)</p>
                <p className="text-sm text-gray-500">ఈ రుసుము సేవా మరియు నమోదు సహాయం కోసం మాత్రమే. పాలసీ జారీ ప్రభుత్వ/కంపెనీ నియమాల ప్రకారం.</p>
              </div>
              <div className="mt-4">
                <button onClick={() => setTab("labour")} className="px-5 py-3 rounded-2xl bg-black text-white">కూలీ ఇన్సూరెన్స్ నమోదు ప్రారంభించండి</button>
              </div>
            </Card>
          </main>
        )}

        {tab === "ideas" && (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Card title="నా యోచన (AI Advisor)" subtitle="తెలుగు లో చిన్న సూచనలు – సీజన్, పంట, పని ప్లాన్లు">
              <div className="space-y-2 text-gray-700">
                <p>ఇది డెమో సెక్షన్. లైవ్ వెర్షన్ లో ప్రశ్న అడిగితే తెలుగులో సమాధానం చూపిస్తాం.</p>
                <ul className="list-disc ml-5">
                  <li>సీజన్ కు సరిపోయే పనుల లిస్ట్</li>
                  <li>దినసరి కూలీ రేటు ట్రాకర్</li>
                  <li>పంట క్యాలెండర్ రిమైండర్లు</li>
                </ul>
              </div>
            </Card>
          </main>
        )}

        {tab === "students" && (
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Card title="విద్య & ఉద్యోగాలు (Students)" subtitle="ప్రభుత్వ పథకాల సమాచారం, కోర్సులు, జాబ్ అలర్ట్స్ – గ్రామ పిల్లల భవిష్యత్తు కోసం">
              <div className="space-y-3 text-gray-700">
                <p>✔️ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్‌మెంట్ గైడెన్స్</p>
                <p>✔️ PMKVY / RSETI / DRDA కోర్సుల సమాచారం</p>
                <p>✔️ జాబ్ అలర్ట్స్ (గ్రూప్స్/WhatsApp SMS – లైవ్‌లో జతచేస్తాం)</p>
                <p className="text-sm text-gray-500">ఇది డెమో; లైవ్‌లో ఫారమ్, అలర్ట్ సబ్‌స్క్రిప్షన్, PDF గైడ్‌లు యాడ్ చేస్తాం.</p>
              </div>
            </Card>
          </main>
        )}

        {tab === "receipts" && (
          <main className="max-w-5xl mx-auto px-4 py-8">
            <Card title="Receipts" subtitle="పేమెంట్ విజయవంతం అయిన నమోదుల రసీదులు ఇక్కడ కనిపిస్తాయి">
              {receipts.length === 0 ? (
                <p className="text-gray-600">ఇంకా రసీదులు లేవు. కూలీ నమోదు చేసి పేమెంట్ చేయండి.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Receipt No</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Mobile</th>
                        <th className="py-2">Village</th>
                        <th className="py-2">Service</th>
                        <th className="py-2 text-right">Amount</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-mono">{r.receiptNo}</td>
                          <td className="py-2">{r.date}</td>
                          <td className="py-2">{r.name}</td>
                          <td className="py-2">{r.mobile}</td>
                          <td className="py-2">{r.village}</td>
                          <td className="py-2">{r.type}</td>
                          <td className="py-2 text-right">₹{r.amount}</td>
                          <td className="py-2"><button onClick={()=>setShow(r)} className="px-3 py-1 rounded-lg border">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </main>
        )}

        <footer className="max-w-6xl mx-auto px-4 pb-10 mt-8 text-sm text-white/90">
          <p>© {new Date().getFullYear()} CoolieHub Foundation • Silent Service, Strong Impact.</p>
        </footer>
      </div>

      <Receipt receipt={show} onClose={()=>setShow(null)} />
    </div>
  );
}
