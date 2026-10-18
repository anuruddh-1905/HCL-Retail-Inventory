import { useState } from 'react'

// Defined outside App so inputs never lose cursor focus while typing
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
      {label}
    </label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      step={type === "number" ? "any" : undefined}
      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none transition-all shadow-2xs"
      required 
    />
  </div>
)

const DEFAULT_FORM = {
  Origin_Port: "PORT09",
  Carrier: "V44_3",
  TPT: 2,
  Service_Level: "CRF",
  Ship_ahead_day_count: 0,
  Customer: "V55_1",
  Product_ID: 1700106,
  Plant_Code: "PLANT16",
  Destination_Port: "PORT09",
  Unit_quantity: 800,
  Weight: 14.5,
  Order_Date: "2026-10-15"
}

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleReset = () => {
    setFormData(DEFAULT_FORM)
    setPrediction(null)
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPrediction(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error("Prediction failed:", error)
      setPrediction({ error: "Cannot reach backend server. Ensure FastAPI is running on port 8000." })
    } finally {
      setLoading(false)
    }
  }

  // Light-mode status badge styling
  const getBadgeStyle = (risk) => {
    if (risk === 'LOW') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (risk === 'MODERATE' || risk === 'MEDIUM') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Standard Top Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
              LP
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">LogiPredict</h1>
              <p className="text-xs text-slate-500 mt-0.5">Retail Inventory & Delay Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Model: Random Forest v1.0
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Shipment Risk Assessment</h2>
            <p className="text-sm text-slate-600 mt-1">
              Enter order dispatch parameters below to estimate transit delay risk.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-auto text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors cursor-pointer"
          >
            Reset Default Values
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Parameter Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-slate-800 pb-4 mb-6 border-b border-slate-100">
              Dispatch Parameters
            </h3>
            
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <InputField label="Origin Port" name="Origin_Port" value={formData.Origin_Port} onChange={handleChange} />
                <InputField label="Destination Port" name="Destination_Port" value={formData.Destination_Port} onChange={handleChange} />
                <InputField label="Carrier" name="Carrier" value={formData.Carrier} onChange={handleChange} />
                <InputField label="Customer ID" name="Customer" value={formData.Customer} onChange={handleChange} />
                <InputField label="Plant Code" name="Plant_Code" value={formData.Plant_Code} onChange={handleChange} />
                <InputField label="Service Level" name="Service_Level" value={formData.Service_Level} onChange={handleChange} />
                <InputField label="Order Date" name="Order_Date" type="date" value={formData.Order_Date} onChange={handleChange} />
                <InputField label="Product ID" name="Product_ID" type="number" value={formData.Product_ID} onChange={handleChange} />
                <InputField label="Unit Quantity" name="Unit_quantity" type="number" value={formData.Unit_quantity} onChange={handleChange} />
                <InputField label="Weight (kg)" name="Weight" type="number" value={formData.Weight} onChange={handleChange} />
                <InputField label="TPT (Transit Days)" name="TPT" type="number" value={formData.TPT} onChange={handleChange} />
                <InputField label="Ship Ahead Days" name="Ship_ahead_day_count" type="number" value={formData.Ship_ahead_day_count} onChange={handleChange} />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-blue-300 cursor-pointer shadow-xs"
                >
                  {loading ? "Running Inference..." : "Run Prediction Model"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Prediction Output & Info Card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-base font-semibold text-slate-800 pb-3 mb-4 border-b border-slate-100">
                Prediction Summary
              </h3>

              {!prediction && !loading && (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-500">
                    Submit the dispatch parameters to generate a delay risk profile.
                  </p>
                </div>
              )}

              {loading && (
                <div className="py-8 text-center">
                  <p className="text-sm font-medium text-blue-600 animate-pulse">
                    Evaluating Random Forest trees...
                  </p>
                </div>
              )}

              {prediction && (
                <div>
                  {prediction.error ? (
                    <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                      {prediction.error}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-sm font-medium text-slate-600">Risk Classification</span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getBadgeStyle(prediction.risk_level)}`}>
                          {prediction.risk_level}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-sm font-medium text-slate-600">Estimated Delay</span>
                        <span className="text-lg font-bold text-slate-900">
                          {prediction.predicted_late_days} <span className="text-xs font-normal text-slate-500">days</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Guidelines / Reference Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs text-slate-600 space-y-2">
              <h4 className="font-semibold text-slate-800 text-sm">Risk Thresholds</h4>
              <p><strong className="text-emerald-700">LOW:</strong> Less than 0.5 predicted late days.</p>
              <p><strong className="text-amber-700">MODERATE:</strong> Between 0.5 and 1.5 late days.</p>
              <p><strong className="text-rose-700">HIGH:</strong> Greater than 1.5 predicted late days.</p>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Standard Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <p>© 2026 Retail Inventory Management System. All rights reserved.</p>
          <p>FastAPI + Scikit-Learn Random Forest Pipeline</p>
        </div>
      </footer>

    </div>
  )
}