import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onChangeArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	onChangeArticleState,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(articleState);

	const asideRef = useRef<HTMLElement>(null);
	const arrowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setFormState(articleState);
	}, [articleState]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node;
			const clickInsideAside = asideRef.current?.contains(target);
			const clickOnArrow = arrowRef.current?.contains(target);

			if (!clickInsideAside && !clickOnArrow) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const updateFormState = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onChangeArticleState(formState);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onChangeArticleState(defaultArticleState);
	};

	return (
		<>
			<div ref={arrowRef}>
				<ArrowButton
					isOpen={isOpen}
					onClick={() => setIsOpen((prevState) => !prevState)}
				/>
			</div>

			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.block}>
						<Text as='h2' size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
					</div>

					<div className={styles.block}>
						<Select
							title='шрифт'
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(option) => updateFormState('fontFamilyOption', option)}
						/>
					</div>

					<div className={styles.block}>
						<RadioGroup
							title='размер шрифта'
							name='fontSizeOption'
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={(option) => updateFormState('fontSizeOption', option)}
						/>
					</div>

					<div className={styles.block}>
						<Select
							title='цвет шрифта'
							selected={formState.fontColor}
							options={fontColors}
							onChange={(option) => updateFormState('fontColor', option)}
						/>
					</div>

					<div className={styles.separatorBlock}>
						<Separator />
					</div>

					<div className={styles.block}>
						<Select
							title='цвет фона'
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={(option) => updateFormState('backgroundColor', option)}
						/>
					</div>

					<div className={styles.block}>
						<Select
							title='ширина контента'
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={(option) => updateFormState('contentWidth', option)}
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};