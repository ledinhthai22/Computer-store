import React, { memo } from 'react';

const InputField = memo(({ label, value, onChange, type = "text", error, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-600 ml-1">{label}</label>
            <input
                {...props}
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border transition-all outline-none ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
            />
            {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
        </div>
    );
});

InputField.displayName = 'InputField';
export default InputField;