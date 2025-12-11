import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { topicMapper } from "../utils/topicMapper";
import { textToBullets } from "../utils/textHelper";
import { generateFinalPptJson } from "../utils/pptJsonBuilder";

/* --------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function TechnicalProposal() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const fileName = state?.fileName || "Document.pdf";

    /* ---------------------------
       RFP PAYLOAD FROM UPLOAD
    --------------------------- */
    const payload = state?.payload || null;
    const rfpData = payload?.proposal || {};

    const projectIntro = rfpData?.project_introduction?.text || "";
    const contentsOfTechnical =
        rfpData?.contents_of_technical_proposal?.text || "";
    const methodologyText =
        rfpData?.methodology_for_executing_services?.text || "";
    const actionPlanText = rfpData?.action_plan?.text || "";
    const executionScheduleText = rfpData?.execution_schedule?.text || "";
    const boothApiText = rfpData?.proposed_booth_designs?.text || "";
    const selectedTemplate = state?.selectedTemplate || 1;

    /* ---------------------------
       LOCAL FORM STATE
    --------------------------- */

    // Step 1 – Project intro
    const [clientName, setClientName] = useState("");
    const [clientLogoFile, setClientLogoFile] = useState(null);
    const [projectOverview, setProjectOverview] = useState(
        contentsOfTechnical || ""
    );
    const [boothPptPath, setBoothPptPath] = useState("");
    const [boothImageUrl, setBoothImageUrl] = useState("");
    const [loadingPpt, setLoadingPpt] = useState(false);


    // Step 2 – Company brief
    const defaultCompanyIntro =
        "تُعد أكسباند قوة رائدة في تنظيم الفعاليات المحلية والدولية وبناء المعارض — بدءًا من توليد الفكرة وتطبيق أحدث تقنيات البناء، وصولًا إلى تجهيزات الافتتاح، وإدارة الحشود، والتغطية الكاملة للحدث.\nنعتمد على خبرة تتجاوز 20 عامًا، جمعت نخبة من الكفاءات متعددة التخصصات، مع قدرة عالية على التكيف مع المتغيرات.\nويلتزم فريقنا بالتميّز والجودة والدقة في الوقت، من خلال شراكات استراتيجية مع الموردين لتنفيذ مشاريع مؤثرة داخل المملكة وخارجها.";
    const [companyIntroText, setCompanyIntroText] = useState(
        defaultCompanyIntro
    );

    // Step 3 – Methodology
    const [methodologyNarrative, setMethodologyNarrative] = useState(
        methodologyText || ""
    );
    const [executionPlanOverview, setExecutionPlanOverview] = useState(
        methodologyText || ""
    );

    // Step 4 – Action plan
    const [activitySteps, setActivitySteps] = useState(actionPlanText || "");

    // Step 5 – Execution schedule
    const [scheduleTable, setScheduleTable] = useState(
        executionScheduleText || ""
    );

    // Step 7 – Booth design
    const [boothUserText, setBoothUserText] = useState("");
    const [loadingBooth, setLoadingBooth] = useState(false);

    // Step 8 – Logistics extra text
    const [otherAddons, setOtherAddons] = useState("");

    /* STEP → JSON KEY MAP
       Only these steps are used in RFP Analysis:
       1,3,4,5,6,7,8  (all except Company Brief)
    */
    const stepKeyMap = {
        1: "project_introduction",
        2: "company_brief_overview",
        3: "methodology_for_executing_services",
        4: "action_plan",
        5: "execution_schedule",
        6: "furniture_samples",
        7: "proposed_booth_designs",
        8: "logistics_services",
    };

    const [activeStep, setActiveStep] = useState(1);

    /* ONLY SHOW RFP CONTENT FOR CURRENT STEP
       If found === true we pick the .text field,
       otherwise RFP Analysis says "No RFP content..."
    */
    const activeRfpKey = stepKeyMap[activeStep];
    const activeRfpItem =
        rfpData[activeRfpKey]?.found ? rfpData[activeRfpKey] : null;

    const stepsList = [
        "Project Introduction",
        "Company Brief",
        "Methodology",
        "Action Plan",
        "Execution Schedule",
        "Furniture Sample",
        "Booth Design",
        "Logistics & Services",
    ];

    const [openCard, setOpenCard] = useState(1);
    const toggleCard = (id) => setOpenCard(openCard === id ? null : id);

    /* --------------------------------------------------------
       NEXT / PREVIOUS
    --------------------------------------------------------- */
    const handleNext = async () => {
        if (activeStep < 8) {
            setActiveStep((prev) => prev + 1);
            return;
        }

        // Step 8 → Generate PPT
        try {
            setLoadingPpt(true); // START LOADING

            const clientProjectName =
                clientName || "تفعيل وادارة أنشطة هيئة الحكومة الرقمية في المؤتمرات والمعارض";

            const clientLogoPath = clientLogoFile || null;

            const boothCombinedText = `${boothApiText || ""}\n${boothUserText || ""}`.trim();

            const userTexts = {
                projectIntro: {
                    projectIntroRfp: projectIntro,
                    projectOverview,
                    clientName,
                },
                companyBrief: companyIntroText,
                methodology: {
                    methodologyRfp: methodologyText,
                    methodologyNarrative,
                    executionPlanOverview,
                },
                actionPlan: activitySteps,
                executionSchedule: scheduleTable,
                boothDesigns: boothCombinedText,
                otherAddons,
            };

            const finalJson = generateFinalPptJson({
                baseRfp: rfpData,
                userTexts,
                clientProjectName,
                clientLogoPath: clientLogoFile?.name || "",
                selectedTemplate,
                boothPptPath
            });

            const formData = new FormData();
            formData.append(
                "json_file",
                new Blob([JSON.stringify(finalJson)], { type: "application/json" }),
                "finalJson.json"
            );

            if (clientLogoFile) formData.append("client_logo", clientLogoFile);

            formData.append("builtin_file_1", "");
            formData.append("builtin_file_2", "");
            formData.append("builtin_file_3", "");
            formData.append("builtin_file_4", "");
            formData.append("builtin_file_5", "");

            const response = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            });

            const blob = await response.blob();
            const fileUrl = URL.createObjectURL(blob);

            navigate("/technical-proposal-preview", {
                state: {
                    fileName,
                    pptUrl: fileUrl,
                    pptBlob: blob,
                },
            });
        } catch (err) {
            alert("❌ Error generating PPT");
            console.error(err);
        } finally {
            setLoadingPpt(false); // STOP LOADING
        }
    };


    const handlePrevious = () => {
        if (activeStep > 1) setActiveStep((prev) => prev - 1);
    };

    const getTitle = () => stepsList[activeStep - 1];

    const getSubtitle = () => {
        switch (activeStep) {
            case 1:
                return "Describe the project overview";
            case 2:
                return "Introduce your company";
            case 3:
                return "Explain your methodology & execution strategy";
            case 4:
                return "Define the activity steps";
            case 5:
                return "Define the project timeline";
            case 6:
                return "Generate AI-powered booth visualizations";
            default:
                return "";
        }
    };

    /* --------------------------------------------------------
       BOOTH GENERATION (unchanged logic – only combined text)
    --------------------------------------------------------- */
    const generateBoothDesign = async () => {
        try {
            setLoadingBooth(true);

            const finalDescription = `${boothApiText || ""}\n${boothUserText || ""}`.trim();
            console.log("FINAL DESCRIPTION:", finalDescription);

            const url = "/api/api/v1/booth/generate?generate_ppt=true";

            const payload = {
                description: finalDescription,
                project_name: clientName || "Default Project",
                client_name: clientName || "",
                booth_type: "media_wall",
                event_type: "trade_show",
                booth_size: "6x6",
                event_date: "2025-12-10",
                venue_location: "Riyadh",
                overall_layout: "Open layout with reception + display area",
                structural_elements: "",
                furniture_seating: "",
                key_features: "",
                technology_screens: "",
                signage_branding: "",
                decorative_elements: "",
                include_people: true,
                staff_count: 10,
                visitor_count: 30,
                primary_colors: "",
                secondary_colors: "",
                design_style: "modern",
                lighting_mood: "bright",
                material_preferences: []
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("API Error: " + response.status);
            }

            const data = await response.json();
            console.log("Booth Response:", data);
            const localUrl = data?.images?.[0]?.local_url || "";

            // create final full URL
            const fullImageUrl = `http://18.234.84.154/api/${localUrl}`;

            // save to state
            setBoothImageUrl(fullImageUrl);
            const boothPptPath = data.ppt_path;

            // ⭐ ADD THIS LINE
            setBoothPptPath(boothPptPath);

            alert("Booth Design Generated Successfully!");

        } catch (error) {
            console.error("Booth Generation Error:", error);
            alert("❌ Error generating booth design!");
        } finally {
            setLoadingBooth(false);
        }
    };


    return (
        <div className="px-6 lg:px-12 xl:px-20 max-w-[1600px] mx-auto mt-10">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <h1 className="text-3xl font-bold text-[#0F172A]">
                    Technical Proposal
                </h1>
            </div>

            <p className="text-gray-500 mt-1">{fileName}</p>

            <div className="grid grid-cols-12 gap-10 mt-10">
                {/* SIDEBAR */}
                <div className="col-span-3">
                    <Sidebar
                        steps={stepsList}
                        activeStep={activeStep}
                        progress={activeStep * 11}
                    />
                </div>

                {/* RIGHT CONTENT */}
                <div className="col-span-9 space-y-6">
                    <>
                        {/* RFP ANALYSIS — HIDDEN ON STEPS 2–5 */}
                        {activeStep !== 2 &&
                            activeStep !== 3 &&
                            activeStep !== 4 &&
                            activeStep !== 5 && (
                                <div
                                    className="bg-[#F4F7FF] p-6 rounded-3xl shadow cursor-pointer"
                                    onClick={() => toggleCard(1)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                                🔍
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">RFP Analysis</h3>
                                                <p className="text-gray-500 text-sm">
                                                    Requirements extracted
                                                </p>
                                            </div>
                                        </div>
                                        {openCard === 1 ? <ChevronUp /> : <ChevronDown />}
                                    </div>

                                    {openCard === 1 && (
                                        <div className="mt-5 space-y-5">
                                            {!activeRfpItem && (
                                                <p className="text-gray-500">
                                                    No RFP content found for this section.
                                                </p>
                                            )}

                                            {activeStep === 1 && (
                                                <div className="p-4 bg-white rounded-xl border shadow-sm">
                                                    <h4 className="text-lg font-semibold">
                                                        PROJECT INTRODUCTION
                                                    </h4>

                                                    <p className="mt-2 text-gray-700 whitespace-pre-line leading-relaxed">
                                                        {projectIntro}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Default for other steps */}
                                            {activeStep !== 1 && activeRfpItem && (
                                                <div className="p-4 bg-white rounded-xl border shadow-sm">
                                                    <h4 className="text-lg font-semibold">
                                                        {activeRfpKey.replace(/_/g, " ").toUpperCase()}
                                                    </h4>

                                                    <p className="mt-2 text-gray-700 whitespace-pre-line leading-relaxed">
                                                        {activeRfpItem.text}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                        {/* AI WRITING – STEPS 1–5 */}
                        {activeStep <= 5 && (
                            <div
                                className="bg-[#EEF2FF] p-6 rounded-3xl shadow cursor-pointer"
                                onClick={() => toggleCard(4)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center">
                                            ✨
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                AI Writing Assistant
                                            </h3>
                                            <p className="text-gray-500 text-sm">{getTitle()}</p>
                                        </div>
                                    </div>
                                    {openCard === 4 ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>
                        )}
                    </>

                    {/* MAIN FORM */}
                    <div className="bg-white p-6 rounded-3xl shadow border">
                        {/* TITLE */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl">
                                {activeStep === 1
                                    ? "📘"
                                    : activeStep === 2
                                        ? "🏢"
                                        : activeStep === 3
                                            ? "🛠️"
                                            : activeStep === 4
                                                ? "📋"
                                                : activeStep === 5
                                                    ? "📅"
                                                    : activeStep === 6
                                                        ? "🪑"
                                                        : activeStep === 7
                                                            ? "🖼️"
                                                            : "🧰"}
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold">{getTitle()}</h3>
                                <p className="text-gray-500 text-sm">{getSubtitle()}</p>
                            </div>
                        </div>

                        {/* STEP 1 */}
                        {activeStep === 1 && (
                            <>
                                <label className="block mt-6 font-medium">Client’s Name</label>
                                <input
                                    type="text"
                                    className="w-full mt-2 p-4 rounded-2xl border shadow-sm"
                                    placeholder="e.g. NCEC"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />

                                <label className="block mt-6 font-medium">Client’s Logo</label>
                                <div className="mt-2 relative">
                                    <input
                                        type="file"
                                        accept="image/png"
                                        className="w-full p-4 pr-12 border rounded-2xl bg-gray-50 shadow-sm cursor-pointer text-gray-600"
                                        onChange={(e) =>
                                            setClientLogoFile(e.target.files?.[0] || null)
                                        }
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5V15"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <label className="block mt-6 font-medium">
                                    Project Overview
                                </label>
                                <textarea
                                    className="w-full mt-2 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="Provide a comprehensive overview..."
                                    value={projectOverview}
                                    onChange={(e) => setProjectOverview(e.target.value)}
                                />

                                <NavigationButtons {...{ handleNext }} disablePrev />
                            </>
                        )}

                        {/* STEP 2 — COMPANY BRIEF */}
                        {activeStep === 2 && (
                            <>
                                <label className="block mt-6 font-medium">
                                    Company Introduction
                                </label>

                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm leading-loose"
                                    value={companyIntroText}
                                    onChange={(e) => setCompanyIntroText(e.target.value)}
                                />

                                <NavigationButtons {...{ handleNext }} disablePrev />


                            </>
                        )}

                        {/* STEP 3 */}
                        {activeStep === 3 && (
                            <>
                                <label className="block mt-6 font-medium">
                                    Methodology Narrative
                                </label>
                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="Describe your methodology..."
                                    value={methodologyNarrative}
                                    onChange={(e) => setMethodologyNarrative(e.target.value)}
                                />

                                <label className="block mt-6 font-medium">
                                    Execution Plan Overview
                                </label>
                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="Detail the execution plan..."
                                    value={executionPlanOverview}
                                    onChange={(e) => setExecutionPlanOverview(e.target.value)}
                                />

                                <NavigationButtons {...{ handleNext }} disablePrev />


                            </>
                        )}

                        {/* STEP 4 */}
                        {activeStep === 4 && (
                            <>
                                <label className="block mt-6 font-medium">Activity Steps</label>

                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="List the key activities & tasks..."
                                    value={activitySteps}
                                    onChange={(e) => setActivitySteps(e.target.value)}
                                />

                                <NavigationButtons {...{ handleNext, handlePrevious }} />
                            </>
                        )}

                        {/* STEP 5 */}
                        {activeStep === 5 && (
                            <>
                                <label className="block mt-6 font-medium">Scheduling Table</label>

                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="Detail timeline, milestones & deadlines..."
                                    value={scheduleTable}
                                    onChange={(e) => setScheduleTable(e.target.value)}
                                />

                                <NavigationButtons {...{ handleNext, handlePrevious }} />
                            </>
                        )}

                        {/* STEP 6 */}
                        {activeStep === 6 && (
                            <>
                                <FurnitureSample />
                                <NavigationButtons {...{ handleNext, handlePrevious }} />
                            </>
                        )}

                        {/* STEP 7 */}
                        {activeStep === 7 && (
                            <>
                                <label className="block mt-6 font-medium">
                                    Enter Booth Description *
                                </label>

                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-40 shadow-sm"
                                    placeholder="Add details for booth design..."
                                    defaultValue={boothApiText}
                                    onChange={(e) => setBoothUserText(e.target.value)}
                                />

                                <div className="flex justify-center my-6">
                                    <button
                                        onClick={generateBoothDesign}
                                        disabled={loadingBooth}
                                        className="px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow disabled:opacity-50"
                                    >
                                        {loadingBooth ? "Generating..." : "Generate Booth Design"}
                                    </button>
                                </div>
                                {boothImageUrl && (
                                    <div className="flex justify-center mt-6">
                                        <img
                                            src={boothImageUrl}
                                            alt="Generated Booth"
                                            className="rounded-2xl shadow-lg border max-w-md"
                                        />
                                    </div>
                                )}

                                <NavigationButtons {...{ handleNext, handlePrevious }} />
                            </>
                        )}

                        {/* STEP 8 */}
                        {activeStep === 8 && (
                            <>
                                <label className="block mt-6 font-medium">Select Services</label>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {[
                                        { name: "Sound system", icon: "🔊" },
                                        { name: "Lighting System", icon: "💡" },
                                        { name: "Hospitality", icon: "🍽️" },
                                        { name: "Suggested Gifts", icon: "🎁" },
                                        { name: "Printing Material", icon: "🖨️" },
                                        { name: "Suggested Hotels", icon: "🏨" },
                                        { name: "Air Tickets", icon: "✈️" },
                                        { name: "Staff", icon: "👥" },
                                        { name: "Equipment", icon: "🛠️" },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-2xl bg-gray-50 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                                                    {item.icon}
                                                </div>
                                                <span className="text-gray-700 font-medium">
                                                    {item.name}
                                                </span>
                                            </div>

                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <label className="block mt-6 font-medium">Other Add-ons</label>
                                <textarea
                                    className="w-full mt-3 p-4 rounded-2xl border h-32 shadow-sm"
                                    placeholder="List any additional services..."
                                    value={otherAddons}
                                    onChange={(e) => setOtherAddons(e.target.value)}
                                />

                                <NavigationButtons
                                    handleNext={handleNext}
                                    handlePrevious={handlePrevious}
                                    loadingPpt={loadingPpt}
                                    disablePrev={undefined}
                                    disableNext={undefined}
                                />

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --------------------------------------------------------
   NAVIGATION BUTTON COMPONENT
--------------------------------------------------------- */
function NavigationButtons({
    handleNext,
    handlePrevious,
    disablePrev,
    disableNext,
    loadingPpt,
}) {

    return (
        <div className="flex justify-between mt-8">
            <button
                disabled={disablePrev}
                onClick={handlePrevious}
                className="px-8 py-3 rounded-2xl border disabled:opacity-40"
            >
                ← Previous
            </button>

            {!disableNext && (
                <button
                    disabled={loadingPpt}
                    onClick={handleNext}
                    className="px-10 py-3 bg-blue-600 text-white rounded-2xl shadow disabled:opacity-40"
                >
                    {loadingPpt ? "Generating PPT..." : "Next →"}
                </button>


            )}
        </div>
    );
}

/* --------------------------------------------------------
   FURNITURE SAMPLE COMPONENT
--------------------------------------------------------- */
function FurnitureSample() {
    const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);

    const addItem = () => {
        setItems([...items, { name: "", qty: 1, price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const itemTotal = (item) => item.qty * item.price;

    const grandTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={addItem} className="px-4 py-2 bg-gray-200 rounded-xl">
                    + Add Item
                </button>
            </div>

            <div className="space-y-6">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-4 gap-4 items-center border p-4 rounded-2xl bg-gray-50 relative"
                    >
                        <input
                            className="p-3 border rounded-xl"
                            placeholder="e.g., Chairs, Tables, Sofas"
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                        />

                        <input
                            type="number"
                            className="p-3 border rounded-xl"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                                updateItem(index, "qty", Number(e.target.value))
                            }
                        />

                        <input
                            type="number"
                            className="p-3 border rounded-xl"
                            min="0"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) =>
                                updateItem(index, "price", Number(e.target.value))
                            }
                        />

                        <div className="font-semibold text-lg">
                            SAR {itemTotal(item)}
                        </div>

                        {items.length > 1 && (
                            <button
                                className="absolute right-4 bottom-4 text-red-500"
                                onClick={() => removeItem(index)}
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-right mt-6 text-xl font-bold">
                Total Furniture Cost: SAR {grandTotal.toLocaleString()}
            </div>
        </div>
    );
}
