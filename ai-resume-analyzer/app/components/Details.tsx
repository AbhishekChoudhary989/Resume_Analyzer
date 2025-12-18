import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";

const Details = ({ feedback }: { feedback: any }) => {
    const categories = [
        { id: "tone", title: "Tone & Style", data: feedback.toneAndStyle },
        { id: "content", title: "Content", data: feedback.content },
        { id: "structure", title: "Structure", data: feedback.structure },
        { id: "skills", title: "Skills", data: feedback.skills },
    ];

    return (
        <Accordion className="w-full">
            {categories.map((cat) => (
                <AccordionItem id={cat.id} key={cat.id}>
                    <AccordionHeader itemId={cat.id}>
                        <div className="flex justify-between w-full">
                            <span className="font-bold">{cat.title}</span>
                            <span>{cat.data?.score}/100</span>
                        </div>
                    </AccordionHeader>
                    <AccordionContent itemId={cat.id}>
                        <div className="space-y-3">
                            {cat.data?.tips.map((tip: any, i: number) => (
                                <div key={i} className={`p-3 rounded-lg border ${tip.type === 'good' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <p className="text-sm font-bold">{tip.tip}</p>
                                    <p className="text-xs">{tip.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default Details;