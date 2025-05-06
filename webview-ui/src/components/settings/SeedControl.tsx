import { VSCodeCheckbox, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState } from "react"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { useDebounce } from "react-use"

interface SeedControlProps {
	value: number | string | undefined | null 
	onChange: (value: number | string | undefined | null) => void
}

export const SeedControl = ({ value, onChange }: SeedControlProps) => {
	const { t } = useAppTranslation()
	const [isCustomSeed, setIsCustomSeed] = useState(value !== undefined && value !== null && value !== "")
	const [inputValue, setInputValue] = useState<string>(value?.toString() ?? "")

	useDebounce(
		() => {
			if (inputValue === "") {
				onChange(null)
			} else {
				const numValue = parseInt(inputValue, 10)
				if (!isNaN(numValue)) {
					onChange(numValue)
				}
			}
		},
		50, 
		[onChange, inputValue]
	)

	// Sync internal state with prop changes when switching profiles.
	useEffect(() => {
		const hasCustomSeed = value !== undefined && value !== null && value !== ""
		setIsCustomSeed(hasCustomSeed)
		setInputValue(value?.toString() ?? "")
	}, [value])

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked
		setIsCustomSeed(isChecked)

		if (!isChecked) {
			setInputValue("") 
		} else {
			setInputValue(value?.toString() ?? "")
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	return (
		<>
			<div>
				<VSCodeCheckbox
					checked={isCustomSeed}
					onChange={handleCheckboxChange}>
					<label className="block font-medium mb-1">{t("settings:seed.useCustom")}</label>
				</VSCodeCheckbox>
				<div className="text-sm text-vscode-descriptionForeground mt-1">
					{t("settings:seed.description")}
				</div>
			</div>

			{isCustomSeed && (
				<div className="flex flex-col gap-3 pl-3 border-l-2 border-vscode-button-background">
					<div>
						<VSCodeTextField
							type="text" 
							value={inputValue}
							onInput={handleInputChange}
							className="w-full"
						/>
						<div className="text-vscode-descriptionForeground text-sm mt-1">
							{t("settings:seed.label")}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
