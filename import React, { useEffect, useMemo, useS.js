import React, { useEffect, useMemo, useState } from 'react';
import { PracticeModeChildProps } from '../PracticeModeTypes'; // adjust path if needed
import { usePractice } from '../usePractice'; // adjust path if needed

function shuffle<T>(arr: T[]) {
    return arr
        .map((v) => ({ v, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map((x) => x.v);
}

const RussianToEngMode: React.FC<PracticeModeChildProps> = ({ onEndCurrentSet }) => {
    const { words } = usePractice(); // expects array of words
    const [index, setIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [finished, setFinished] = useState(false);

    const total = words?.length || 0;
    const current = words && words[index];

    // NOTE: adjust property names below if your word shape differs (e.g., .ru / .en)
    const choices = useMemo(() => {
        if (!words || !current) return [];
        const correct = current.english ?? current.en ?? current.translation ?? current.translate ?? current.wordEnglish;
        const distractors = words
            .filter((w) => w !== current)
            .map((w) => w.english ?? w.en ?? w.translation ?? w.translate ?? w.wordEnglish)
            .filter(Boolean);

        const pick = shuffle(distractors).slice(0, Math.max(0, Math.min(3, distractors.length)));
        return shuffle([correct, ...pick]);
    }, [words, current]);

    useEffect(() => {
        if (!words || words.length === 0) return;
        // reset when words change
        setIndex(0);
        setMistakes(0);
        setFinished(false);
    }, [words]);

    const handleChoose = (choice: string) => {
        if (!current) return;
        const correct = current.english ?? current.en ?? current.translation ?? current.translate ?? current.wordEnglish;
        if (choice !== correct) setMistakes((m) => m + 1);

        if (index + 1 >= total) {
            setFinished(true);
            // show summary briefly then notify parent
            setTimeout(() => {
                onEndCurrentSet?.();
            }, 250);
        } else {
            setIndex((i) => i + 1);
        }
    };

    if (!words || total === 0) return <div>No words to practice.</div>;

    if (finished) {
        return (
            <div>
                <h3>Session complete</h3>
                <p>You made {mistakes} mistake{mistakes === 1 ? '' : 's'} while reviewing {total} word{total === 1 ? '' : 's'}.</p>
                <button onClick={() => onEndCurrentSet?.()}>Continue</button>
            </div>
        );
    }

    const russian = current.russian ?? current.ru ?? current.wordRussian ?? current.question ?? current.text;

    return (
        <div>
            <div>Progress: {index + 1} / {total}</div>
            <h2>{russian}</h2>
            <div>
                {choices.map((c) => (
                    <button key={c} onClick={() => handleChoose(c)} style={{ display: 'block', margin: 6 }}>
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RussianToEngMode;