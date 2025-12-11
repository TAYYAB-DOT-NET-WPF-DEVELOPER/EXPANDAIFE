import PPT_TEMPLATE from "../data/pptTemplate.json";
import { topicMapper } from "./topicMapper";
import { textToBullets } from "./textHelper";

export function generateFinalPptJson({
    baseRfp,
    userTexts,
    clientProjectName,
    clientLogoPath,
    selectedTemplate,
    boothPptPath      // 🔥 NEW PARAM
}) {

    const templatePath =
        selectedTemplate === 1 || selectedTemplate === 2
            ? "given_sample.pptx"
            : "sample.pptx";

    const finalJson = {
        config: {
            ...PPT_TEMPLATE.config,
            project_name: clientProjectName || PPT_TEMPLATE.config.project_name,
            client_logo: clientLogoPath || PPT_TEMPLATE.config.client_logo,
            template_path: templatePath
        },

        topics: PPT_TEMPLATE.topics.map(topic => {
            const arabicTopic = topic.topic;

            // 🔥 If this is the booth topic → inject API ppt_path
            if (arabicTopic === "تصاميم الأجنحة المقترحة" && boothPptPath) {
                return {
                    ...topic,
                    included: true,
                    has_builtin: true,
                    builtin_ppt_path: boothPptPath, // 🔥 SAVE API FILE HERE
                    bullets: textToBullets(userTexts?.boothDesigns || "")
                };
            }

            const englishKey = Object.keys(topicMapper).find(
                key => topicMapper[key] === arabicTopic
            );

            if (!englishKey) return topic;

            const rfpSection = baseRfp[englishKey];
            const userText = userTexts?.[englishKey];

            const finalText = userText || rfpSection?.text || "";
            const finalBullets = textToBullets(finalText);

            return {
                ...topic,
                included: true,
                bullets: finalBullets
            };
        })
    };

    console.log("FINAL JSON STRING:", JSON.stringify(finalJson, null, 2));
    return finalJson;
}


