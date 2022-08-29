/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
 import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Components to use
 */

 import { SelectControl, TextControl } from '@wordpress/components';
 import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const stickyPosts = useSelect( ( select ) => {
		return (attributes.queryType=='postType') ? select( 'core' ).getEntityRecords( 'postType', attributes.queryValue, { sticky: true } ) : select( 'core' ).getEntityRecords( 'postType', 'post', { categories: attributes.queryValue, sticky: true } );
	}, [] );
	const nonStickyPosts = useSelect( ( select ) => {
		return (attributes.queryType=='postType') ? select( 'core' ).getEntityRecords( 'postType', attributes.queryValue ) : select( 'core' ).getEntityRecords( 'postType', 'post', { categories: attributes.queryValue } );
	}, [] );

	const categoriesList = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'category' );
	}, [] );
	const categoriesListOptions = ( categoriesList ) ? categoriesList.map(item => ({ label: item.name, value: item.slug })) : {};

	const defaultPostTypes = ['page','attachment','nav_menu_item','wp_block','wp_template','wp_template_part','wp_navigation'];
	const postTypesList = useSelect( ( select ) => {
		return select( 'core' ).getPostTypes();
	}, [] );
	const postTypesListOptions = ( postTypesList ) ? postTypesList.filter(item => { return (!defaultPostTypes.includes(item.slug)) }).map(item => ({ label: item.name, value: item.slug })) : {};


	const onChangeQueryType = ( queryType ) => {
		setAttributes( { queryType: queryType } );
	};

	const onChangeQueryValue = ( queryValue ) => {
		setAttributes( { queryValue: queryValue } );
	};

	const onChangeTitle = ( title ) => {
		setAttributes( { title: title } );
	};

	return (
		<p { ...blockProps }>
			<InspectorControls key="setting">
				<div id="pinned-post-controls">
					<fieldset>
						<TextControl
							label="Title"
							value={ attributes.title }
							onChange={ onChangeTitle }
						/>
					</fieldset>
					<fieldset>
						<SelectControl
							label="Query type"
							value={ attributes.queryType }
							onChange={ onChangeQueryType }
							options={
								[
									{
										label: 'Post Type',
										value: 'postType'
									},
									{
										label: 'Category',
										value: 'category'
									}
								]
							}
						/>
					</fieldset>
					<fieldset>
						{ attributes.queryType == 'category' && (
							<SelectControl
								label="Category"
								value={ attributes.queryValue }
								onChange={ onChangeQueryValue }
								options={ categoriesListOptions }
							/>
						) }
						{ attributes.queryType == 'postType' && (
							<SelectControl
								label="Post Type"
								value={ attributes.queryValue }
								onChange={ onChangeQueryValue }
								options={ postTypesListOptions }
							/>
						) }
					</fieldset>
				</div>
			</InspectorControls>
			{ attributes.title }<br />
			{ ! stickyPosts && ! nonStickyPosts && 'Loading' }
			{ stickyPosts && stickyPosts.length === 0 && nonStickyPosts && nonStickyPosts.length === 0 && 'No Posts' }
			{ stickyPosts && stickyPosts.length === 0 && nonStickyPosts && nonStickyPosts.length > 0 && (
				<a href={ nonStickyPosts[ 0 ].link }>
					{ nonStickyPosts[ 0 ].title.raw }
				</a>
			) }
			{ stickyPosts && stickyPosts.length > 0 && (
				<a href={ stickyPosts[ 0 ].link }>
					{ stickyPosts[ 0 ].title.raw }
				</a>
			) }
		</p>
	);
}
