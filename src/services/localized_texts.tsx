import * as React from 'react';
import * as memoizee from 'memoizee';

import * as ES from '../assets/ES/localized_texts.json';
import * as EN from '../assets/EN/localized_texts.json';
import * as DE from '../assets/DE/localized_texts.json';

type AvailableLanguages = "ES" | "EN" | "DE";

class LocalizeService {
    private language: AvailableLanguages = "EN";
    private texts: { [key: string]: any } = {
        EN,
        ES,
        DE,
    };
    public setLanguage(lang: AvailableLanguages) {
        this.language = lang;
    }
    public getLanguage() {
        return this.language;
    }
    public getLiteral(id: string, ...substitutions: string[]): any {
        // can return string, or mixed array with strings and JSX
        if (typeof id === "string") {
            const baseText = this.getLiteralWithLanguage(id, this.language) || "";
            // line breaks
            const textBlockArray: any[] = baseText.split("\n");
            // tslint:disable-next-line:prefer-const
            for (let i = 0, write = 1, length = textBlockArray.length; i < length - 1; i++) {
                textBlockArray.splice(write, 0, <br key={i} />);
                write += 2;
            }
            const resultArray: any[] = [];
            textBlockArray.map((textBlock: any) => {
                if (typeof textBlock === "string") {
                    const textArray: any[] = textBlock.split(/%[\d]+\$s/);
                    // substitutions
                    const maxLoop = Math.min(textArray.length - 1, substitutions.length);
                    for (let i = 0, write = 1; i < maxLoop; i++) {
                        let text = "";
                        if (substitutions[i]) {
                            text = this.getLiteral(substitutions[i]) || "";
                        }
                        textArray.splice(write, 0,
                            <span className={`substitution substitution-${i + 1} ${id}-${substitutions[i]}`}
                                data-index={`${i}`}>{text}
                            </span>,
                        );
                        write += 2;
                    }
                    resultArray.push(textArray);
                } else {
                    resultArray.push(textBlock);
                }
            });

            return resultArray;
        } else {
            return "";
        }
    }
    public getLiteralWithLanguage(id: string, language: AvailableLanguages) {
        try {
            const text = this.texts[language][id];
            if (!text) {
                console.error(`Missing literal in ${language}, ${id}`);
                throw new Error(`Missing literal in ${language}, ${id}`);
            }
            return text;
        } catch (e) {
            const text = this.texts.EN[id];
            if (text) {
                return text;
            } else {
                return "Missing literal";
            }
        }
    }
    public textToMarkupWithLineBreaks(text: string, separator: string = "\\n") {
        if (typeof text === "string") {
            return text.split(separator).map((item, key) => {
                return (
                    <p key={key}>
                        {item}
                    </p>
                );
            });
        }
    }
}

export const Localized = new LocalizeService();
export const Localize = memoizee(Localized.getLiteral.bind(Localized));

(window as any).Localized = Localized;
(window as any).Localize = Localized.getLiteral.bind(Localized);
