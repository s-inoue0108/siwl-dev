import fs from "fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const getImageResponse = async (title: string): Promise<Response> => {
	const montserratRegular = fs.readFileSync("src/assets/fonts/Montserrat-Regular.ttf");
	const montserratBold = fs.readFileSync("src/assets/fonts/Montserrat-Bold.ttf");
	const notoSansJPRegular = fs.readFileSync("src/assets/fonts/NotoSansJP-Regular.ttf");
	const notoSansJPBold = fs.readFileSync("src/assets/fonts/NotoSansJP-Bold.ttf");

	const siwl = fs.readFileSync("src/assets/images/siwl-logo-white.svg").toString("base64");
	const profileImage = fs.readFileSync("src/assets/images/profile-image.jpg").toString("base64");

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
					backgroundColor: "rgb(4, 8, 24)",
					backgroundImage:
						"radial-gradient(ellipse at left center, rgb(30, 70, 180) 0%, transparent 70%), radial-gradient(ellipse at right center, rgb(120, 82, 220) 0%, transparent 70%)",
				},
				children: [
					{
						type: "section",
						props: {
							style: {
								position: "absolute",
								width: "1184px",
								height: "624px",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								padding: "0 32px",
							},
							children: [
								{
									type: "h1",
									props: {
										style: {
											width: "100%",
											color: "rgb(252, 252, 252)",
											fontWeight: "700",
											fontSize: "4.6rem",
										},
										children: `${title}`,
									},
								},
								{
									type: "img",
									props: {
										style: {
											position: "absolute",
											bottom: "-64px",
											left: "32px",
										},
										src: `data:image/svg+xml;base64,${siwl}`,
										width: 320,
										height: 320,
										alt: "SIWL.dev",
									},
								},
								{
									type: "div",
									props: {
										style: {
											position: "absolute",
											bottom: "32px",
											right: "32px",
											display: "flex",
											alignItems: "center",
											gap: "1.6rem",
										},
										children: [
											{
												type: "div",
												props: {
													style: {
														display: "block",
														position: "relative",
														width: "4.6rem",
														height: "4.6rem",
														backgroundImage:
															"linear-gradient(90deg, rgb(30, 70, 180), rgb(82, 152, 236), rgb(183, 154, 237), rgb(120, 82, 220))",
														borderRadius: "9999px",
													},
												},
											},
											{
												type: "img",
												props: {
													style: {
														position: "absolute",
														top: "50%",
														left: "0.3rem",
														transform: "translateY(-50%)",
														width: "4rem",
														height: "4rem",
														objectFit: "cover",
														borderRadius: "9999px",
													},
													src: `data:image/jpeg;base64,${profileImage}`,
													width: 1008,
													height: 756,
													alt: "SIWL.dev",
												},
											},
											{
												type: "p",
												props: {
													style: {
														color: "rgb(252, 252, 252)",
														fontWeight: "400",
														fontSize: "3.45rem",
													},
													children: "Shota Inoue",
												},
											},
										],
									},
								},
							],
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
