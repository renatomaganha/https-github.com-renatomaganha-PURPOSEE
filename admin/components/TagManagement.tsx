import React, { useState, useMemo, useRef } from 'react';
import { Tag, TagCategory } from '../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';

interface TagManagementProps {
    tags: Tag[];
    onAddTag: (newTag: Omit<Tag, 'id' | 'created_at'>) => Promise<void>;
    onUpdateTag: (updatedTag: Tag) => Promise<void>;
    onDeleteTag: (tagId: string) => Promise<void>;
}

const categoryTitles: Record<TagCategory, string> = {
    denominations: 'Denominações',
    keyValues: 'Valores de Fé',
    interests: 'Interesses',
    languages: 'Idiomas'
};

// Dados de Emojis organizados por categorias oficiais (WhatsApp Style)
const EMOJI_CATEGORIES = [
    { id: 'smileys', icon: '😀', label: 'Smileys & Emoções', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'] },
    { id: 'people', icon: '👋', label: 'Pessoas & Corpo', emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵'] },
    { id: 'nature', icon: '🐶', label: 'Animais & Natureza', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🪵', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🪨', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅️', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '☃️', '⛄️', '🌬️', '💨', '💧', '💦', '☔️', '☂️', '🌊', '🌫️'] },
    { id: 'food', icon: '🍎', label: 'Comida & Bebida', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥣', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🫙'] },
    { id: 'activity', icon: '⚽', label: 'Atividades', emojis: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'] },
    { id: 'travel', icon: '🚗', label: 'Viagem & Lugares', emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🛹', '🚏', '🛣️', '🛤️', '⛽️', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓️', '⛵️', '🚤', '🛳️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🪐', '🌠', '🌌', '⛱️', '🎆', '🎇', '🎑', '🗼', '🗽', '⛩️', '🕋', '⛲️', '⛺️', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🚡', '🚠', '🚟', '🚠', '🛶', '⛵️', '🚤', '🛳️', '⛴️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🚀', '🛸'] },
    { id: 'objects', icon: '💡', label: 'Objetos', emojis: ['⌚️', '📱', '📲', '💻', '⌨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪝', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪥', '🪒', '🧽', '🪣', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '🪪', '📪', '📫', '📬', '📭', '📮', '🗳️', '📜', '📑', '🧾', '📊', '📈', '📉', '📄', '📅', '📆', '🗓️', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝'] },
    { id: 'symbols', icon: '❤️', label: 'Símbolos', emojis: ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '♨️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️', '✴️', 'vs', '💮', '🉐', '㊙️', '㊗️', '🈴', '🅰️', '🅱️', 'AB', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫️', '⚪️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️'] },
    { id: 'flags', icon: '🇧🇷', label: 'Bandeiras', emojis: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇦', '🇮🇨', '🇨🇻', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇪🇺', '🇫🇰', '🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵', '🇲🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇦🇪', '🇬🇧', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇪', '🇻🇳', '🇿🇲', '🇿🇼'] },
];

const WhatsAppEmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
    const [activeTab, setActiveTab] = useState(EMOJI_CATEGORIES[0].id);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToCategory = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(`emoji-section-${id}`);
        if (element && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: element.offsetTop - scrollContainerRef.current.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-4 bg-[#f0f2f5] rounded-2xl border border-slate-300 shadow-2xl overflow-hidden animate-pop w-[320px] sm:w-[380px] flex flex-col">
            {/* Barra de Abas Estilo WhatsApp (Topo) */}
            <div className="flex bg-[#f0f2f5] border-b border-slate-300 p-1">
                {EMOJI_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => scrollToCategory(cat.id)}
                        className={`flex-1 py-2 text-xl transition-all border-b-2 flex items-center justify-center ${activeTab === cat.id ? 'border-sky-500 text-sky-500 scale-110' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        title={cat.label}
                    >
                        {cat.icon}
                    </button>
                ))}
            </div>

            {/* Conteúdo com Scroll */}
            <div 
                ref={scrollContainerRef}
                className="h-[320px] overflow-y-auto p-4 space-y-6 bg-white custom-scrollbar"
                onScroll={(e) => {
                    // Lógica básica para atualizar aba ativa conforme scroll (opcional)
                }}
            >
                {EMOJI_CATEGORIES.map(category => (
                    <div key={category.id} id={`emoji-section-${category.id}`} className="emoji-category-section">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 sticky top-0 bg-white/90 backdrop-blur-sm py-1 z-10">
                            {category.label}
                        </h3>
                        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
                            {category.emojis.map((emoji, i) => (
                                <button
                                    key={`${category.id}-${i}`}
                                    type="button"
                                    onClick={() => onSelect(emoji)}
                                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-slate-100 rounded-lg transition-all active:scale-150 active:rotate-12 focus:outline-none"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Barra Inferior (Style WhatsApp) */}
            <div className="bg-[#f0f2f5] h-8 flex items-center px-4">
                 <div className="w-full h-1 bg-slate-300 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: '10%' }}></div>
                 </div>
            </div>
        </div>
    );
};

const TagItem: React.FC<{
    tag: Tag;
    onUpdate: (updatedTag: Tag) => Promise<void>;
    onDelete: (tagId: string) => Promise<void>;
}> = ({ tag, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(tag.name);
    const [emoji, setEmoji] = useState(tag.emoji || '');
    const [showPicker, setShowPicker] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ ...tag, name, emoji });
            setIsEditing(false);
            setShowPicker(false);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setName(tag.name);
        setEmoji(tag.emoji || '');
        setIsEditing(false);
        setShowPicker(false);
    }

    return (
        <div className="flex flex-col gap-2 p-3 bg-slate-100 rounded-xl text-sm group transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200">
            <div className="flex items-center justify-between">
                {isEditing ? (
                    <div className="flex flex-col gap-2 w-full pr-8">
                        <div className="flex gap-2 relative">
                             <button 
                                type="button"
                                onClick={() => setShowPicker(!showPicker)}
                                className="w-12 h-10 bg-white border border-sky-500 rounded-lg text-center text-lg flex items-center justify-center hover:bg-sky-50 shadow-sm"
                            >
                                {emoji || '·'}
                            </button>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="flex-grow p-1 border border-sky-500 rounded-lg text-sm px-3 shadow-sm outline-none"
                                autoFocus
                            />
                        </div>
                        {showPicker && (
                            <div className="absolute z-50 left-0 top-12">
                                <WhatsAppEmojiPicker onSelect={(e) => { setEmoji(e); setShowPicker(false); }} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="text-xl bg-white w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border border-slate-100">{tag.emoji || '·'}</span>
                        <span className="font-bold text-slate-700">{tag.name}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 ml-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-800 disabled:opacity-50">
                                {isSaving ? <div className="w-5 h-5 border-2 border-t-green-600 border-slate-200 rounded-full animate-spin"></div> : <CheckIcon className="w-6 h-6" />}
                            </button>
                            <button onClick={handleCancel} disabled={isSaving} className="text-slate-500 hover:text-slate-700 disabled:opacity-50"><XIcon className="w-6 h-6" /></button>
                        </>
                    ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                            <button onClick={() => setIsEditing(true)} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-white rounded-lg shadow-sm border border-slate-100 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(tag.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg shadow-sm border border-slate-100 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TagCategoryCard: React.FC<{
    category: TagCategory;
    tags: Tag[];
    onAdd: (newTag: Omit<Tag, 'id' | 'created_at'>) => Promise<void>;
    onUpdate: (updatedTag: Tag) => Promise<void>;
    onDelete: (tagId: string) => Promise<void>;
}> = ({ category, tags, onAdd, onUpdate, onDelete }) => {
    const [newTagName, setNewTagName] = useState('');
    const [newTagEmoji, setNewTagEmoji] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (newTagName.trim()) {
            setIsAdding(true);
            try {
                await onAdd({ name: newTagName, emoji: newTagEmoji, category });
                setNewTagName('');
                setNewTagEmoji('');
                setShowPicker(false);
            } finally {
                setIsAdding(false);
            }
        }
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col h-[560px] border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center justify-between">
                {categoryTitles[category]}
                <span className="text-[10px] font-black bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">{tags.length} TAGS</span>
            </h2>
            
            <div className="flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {tags.map(tag => (
                    <TagItem key={tag.id} tag={tag} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
                {tags.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                         <TagIcon className="w-12 h-12 opacity-20 mb-2"/>
                         <p className="text-center text-xs font-bold uppercase tracking-widest">Vazio</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 relative">
                {showPicker && (
                    <div className="absolute bottom-full left-0 z-50 mb-2">
                        <WhatsAppEmojiPicker onSelect={(e) => { setNewTagEmoji(e); setShowPicker(false); }} />
                    </div>
                )}
                
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => setShowPicker(!showPicker)}
                            className={`w-12 h-10 flex items-center justify-center rounded-xl border-2 transition-all ${newTagEmoji ? 'border-sky-500 bg-sky-50 text-2xl shadow-inner' : 'border-slate-200 text-slate-400 hover:border-sky-300 hover:bg-slate-50'}`}
                        >
                            {newTagEmoji || '+'}
                        </button>
                        <input
                            type="text"
                            placeholder="Nova Tag..."
                            value={newTagName}
                            onChange={e => setNewTagName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            className="flex-grow p-2 border-2 border-slate-200 rounded-xl text-sm focus:border-sky-500 outline-none px-4 shadow-sm"
                            disabled={isAdding}
                        />
                    </div>
                    <button 
                        onClick={handleAdd} 
                        disabled={!newTagName.trim() || isAdding}
                        className="w-full bg-sky-600 text-white font-black uppercase tracking-widest py-3 rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
                    >
                        {isAdding ? (
                            <div className="w-5 h-5 border-2 border-t-white border-sky-400 rounded-full animate-spin"></div>
                        ) : (
                            <><PlusIcon className="w-4 h-4" /> Adicionar</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const TagManagement: React.FC<TagManagementProps> = ({ tags, onAddTag, onUpdateTag, onDeleteTag }) => {

    const tagsByCategory = useMemo(() => {
        const grouped = tags.reduce((acc, tag) => {
            if (!acc[tag.category]) {
                acc[tag.category] = [];
            }
            acc[tag.category].push(tag);
            return acc;
        }, {} as Record<TagCategory, Tag[]>);

        // Ordenar cada categoria em ordem alfabética
        Object.keys(grouped).forEach(cat => {
            grouped[cat as TagCategory].sort((a, b) => a.name.localeCompare(b.name));
        });

        return grouped;
    }, [tags]);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-1">Gestão de Tags</h1>
                    <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
                        Personalize as opções que aparecem nos perfis e filtros. 
                        Use emojis para deixar o app mais amigável.
                    </p>
                </div>
                <div className="bg-sky-50 border border-sky-100 px-4 py-2 rounded-xl text-sky-700 text-xs font-bold uppercase tracking-widest">
                    Total: {tags.length} Ativas
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {(Object.keys(categoryTitles) as TagCategory[]).map(category => (
                    <TagCategoryCard
                        key={category}
                        category={category}
                        tags={tagsByCategory[category] || []}
                        onAdd={onAddTag}
                        onUpdate={onUpdateTag}
                        onDelete={onDeleteTag}
                    />
                ))}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .emoji-category-section { scroll-margin-top: 40px; }
            `}</style>
        </div>
    );
};

// Re-importing icons to ensure they are available in this context
const TagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
