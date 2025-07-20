
"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Eye, Users } from "lucide-react";
import image from "./images/indian-farmer-1610471656527.avif"

const teamMembers = [
  {
    nameKey: "team_member_1_name",
    roleKey: "team_member_1_role",
    image: "/images/team1.jpg",
    fallback: "DA",
    "data-ai-hint": "scientist portrait",
  },
  {
    nameKey: "team_member_2_name",
    roleKey: "team_member_2_role",
    image: "/images/team2.jpg",
    fallback: "PS",
    "data-ai-hint": "woman portrait",
  },
  {
    nameKey: "team_member_3_name",
    roleKey: "team_member_3_role",
    image: "/images/team3.jpg",
    fallback: "RK",
    "data-ai-hint": "man engineer",
  },
  {
    nameKey: "team_member_4_name",
    roleKey: "team_member_4_role",
    image: "/images/team4.jpg",
    fallback: "AD",
    "data-ai-hint": "woman designer",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div id="about-us" className="container mx-auto px-4 py-12 space-y-12 scroll-mt-20">
      <header className="text-center">
        <h1 className="text-4xl font-headline text-primary">
          {t("about_title")}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("about_subtitle")}
        </p>
      </header>

      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <Image
          src={image}
          alt="Lush green farm"
          width={1200}
          height={500}
          className="w-full h-full object-cover"
          data-ai-hint="farm field"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              {t("our_mission_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("our_mission_desc")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-3">
              <Eye className="w-8 h-8 text-primary" />
              {t("our_vision_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("our_vision_desc")}</p>
          </CardContent>
        </Card>
      </div>

      <section className="text-center">
        <h2 className="text-3xl font-headline text-primary flex items-center justify-center gap-3">
          <Users className="w-8 h-8" />
          {t("meet_team_title")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("meet_team_subtitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center p-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-accent">
                  <Image
                    src={`https://placehold.co/100x100.png`}
                    alt={t(member.nameKey)}
                    width={100}
                    height={100}
                    data-ai-hint={member["data-ai-hint"]}
                  />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold font-headline">
                  {t(member.nameKey)}
                </h3>
                <p className="text-sm text-primary">{t(member.roleKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
