import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";

export default function Home() {
  return (
    <>
      <Hero />

      <TextSection
        heading="Welcome to Our Gallery"
        paragraph="Explore our curated collection of images. Click any thumbnail to view it in full size and navigate through the gallery seamlessly. Our gallery showcases high-quality visuals in a user-friendly and responsive layout."
        bgColor="#f9f9f9"
        buttonText="Go to Gallery"
        buttonLink="/gallery"
      />


      <TextSection
        heading="संस्थान का परिचय"
        paragraph="परम पूज्य आचार्य श्री 108 सुनील सागर जी महाराज के मंगलमय आशीर्वाद एवं आचार्य श्री जी की प्रेरणा से संस्थान की स्थापना हुई। जहाँ पूरे विश्व में महामारी थी, वहीं गुरुदेव की प्रेरणा से संस्था का जन्म हुआ। गुरुदेव के मन में आया कि हम गरीब, असहाय बच्चों के लिए एक ऐसी संस्था की आधारशिला रखें जिससे समस्त जैन बच्चे शिक्षा ग्रहण कर जैन समाज का देश-विदेश में परचम लहराएँगे। बच्चे आगे बढ़कर समाज हित व देश हित में योगदान देने में सक्षम हो जाएंगे। इस संस्था की स्थापना कोरोना काल में हुई, किंतु राज्य सरकार से अनुमति न मिल सकी, इस कारण से संस्था को सन 2022 में प्रारंभ किया गया। संस्थान के संस्थापक ब्रह्मचारी अरविंद जी गांधी (मुंबई निवासी) परिवार ने यहाँ पर सुन्दर बिल्डिंग का निर्माण कराया। संस्थान के निदेशक वरिष्ठ ब्रह्मचारी विनय भैया जी के निर्देशन में इस संस्था में वर्ष 2022-2023 में 22 बच्चों को लेकर शुरुआत हुई और वर्ष 2023-2024 में बच्चों की संख्या बढ़कर 40 हो गई। 2024-2025 में बच्चों की संख्या बढ़कर 50 हो गई। 2025-2026 में इस वर्ष बच्चों की संख्या बढ़कर 70 हो गई है। बच्चे सन्मति प्राकृत विद्यापीठ में अध्ययनरत् हैं।`"
        bgColor="#ffffff"
      />
    </>
  );
}
