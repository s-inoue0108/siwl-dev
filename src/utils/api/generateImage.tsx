import fs from "fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
export const getImageResponse = async (title: string): Promise<Response> => {
	const montserratRegular = fs.readFileSync("src/assets/fonts/Montserrat-Regular.ttf");
	const montserratBold = fs.readFileSync("src/assets/fonts/Montserrat-Bold.ttf");
	const notoSansJPRegular = fs.readFileSync("src/assets/fonts/NotoSansJP-Regular.ttf");
	const notoSansJPBold = fs.readFileSync("src/assets/fonts/NotoSansJP-Bold.ttf");

	const width = 1280;
	const height = 720;

	const svg = await satori(
		{
			type: "main",
			props: {
				style: {
					position: "relative",
					width: "100%",
					height: "100%",
					fontFamily: "Montserrat, Noto Sans JP, sans-serif",
					backgroundImage: "linear-gradient(90deg, #9B79E9 0%, #8960D9 50%, #7749C3 100%)",
				},
				children: [
					{
						type: "h1",
						props: {
							style: {
								width: "100%",
								color: "#fcfcfc",
								fontWeight: "700",
								fontSize: "6rem",
								padding: "1rem 2rem",
							},
							children: `${title}`,
						},
					},
					{
						type: "img",
						props: {
							style: {
								width: "128px",
								position: "absolute",
								bottom: "1rem",
								right: "2rem",
							},
							src: `${import.meta.env.APP_URL}/src/assets/images/siwl-logo.svg`,
							alt: "logo",
						},
					},
				],
			},
		},
		{
			width,
			height,
			fonts: [
				{
					name: "Montserrat",
					data: montserratRegular,
					weight: 400,
					style: "normal",
				},
				{
					name: "Montserrat",
					data: montserratBold,
					weight: 700,
					style: "normal",
				},
				{
					name: "Noto Sans JP",
					data: notoSansJPRegular,
					weight: 400,
					style: "normal",
				},
				{
					name: "Noto Sans JP",
					data: notoSansJPBold,
					weight: 700,
					style: "normal",
				},
			],
		}
	);

	const resvg = new Resvg(svg, {
		font: {
			loadSystemFonts: false,
		},
		fitTo: {
			mode: "width",
			value: width,
		},
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
