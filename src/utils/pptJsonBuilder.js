import PPT_TEMPLATE from "../data/pptTemplate.json";
import { topicMapper } from "./topicMapper";
import { textToBullets } from "./textHelper";
import TEMPLATE_LIST from "../data/templates";
/* 🔁 Service key ↔ Arabic topic map */
const serviceTopicMapReverse = {
  "نظام الصوت": "soundSystem",
  "نظام الإضاءة": "lightingSystem",
  "خدمات الضيافة": "hospitality",
  "الهدايا المقترحة": "gifts",
  "مواد الطباعة": "printing",
  "الفنادق المقترحة": "hotels",
  "تذاكر طيران": "airTickets",
  "الطاقم": "staff",
  "معدات": "equipment",
};

export function generateFinalPptJson({
  baseRfp,
  userTexts,
  clientProjectName,
  clientLogoPath,
  selectedTemplate,
  boothPptPath,
  selectedServices = {}   // ✅ RECEIVE HERE
}) {

 const selectedTemplateObj = TEMPLATE_LIST.find(
  (tpl) => tpl.id === selectedTemplate
);

const templatePath =
  selectedTemplateObj?.name === "Template A"
    ? "template/sample_1.pptx"
    : "template/sample_2.pptx";
  const finalJson = {
    config: {
      ...PPT_TEMPLATE.config,
      project_name: clientProjectName || PPT_TEMPLATE.config.project_name,
      client_logo: clientLogoPath || PPT_TEMPLATE.config.client_logo,
      template_path: templatePath
    },

    topics: PPT_TEMPLATE.topics.map(topic => {
      const arabicTopic = topic.topic;

      /* 🔹 SERVICE BASED INCLUDE LOGIC */
      const isServiceTopic = serviceTopicMapReverse[arabicTopic];
      const isIncluded = isServiceTopic
        ? !!selectedServices[isServiceTopic]
        : true;

      /* 🔥 Booth special case */
      if (arabicTopic === "تصاميم الأجنحة المقترحة" && boothPptPath) {
        return {
          ...topic,
          included: isIncluded,
          has_builtin: true,
          builtin_ppt_path: boothPptPath,
          bullets: textToBullets(userTexts?.boothDesigns || "")
        };
      }

      const englishKey = Object.keys(topicMapper).find(
        key => topicMapper[key] === arabicTopic
      );

      if (!englishKey) {
        return {
          ...topic,
          included: isIncluded
        };
      }

      const rfpSection = baseRfp[englishKey];
      const userText = userTexts?.[englishKey];

      const finalText = userText || rfpSection?.text || "";
      const finalBullets = textToBullets(finalText);

      return {
        ...topic,
        included: isIncluded,
        bullets: finalBullets
      };
    })
  };

  console.log("FINAL JSON STRING:", JSON.stringify(finalJson, null, 2));
  return finalJson;
}
