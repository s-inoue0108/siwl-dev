import type { MarkdownHeading } from "astro";

interface Props {
	headings: MarkdownHeading[];
}

const Toc = ({ headings }: Props) => {
	return (
		<ul>
			{headings.map((heading) => (
				<li>
					<a href={`#${heading.slug}`}>{heading.text}</a>
				</li>
			))}
		</ul>
	);
};

export default Toc;
