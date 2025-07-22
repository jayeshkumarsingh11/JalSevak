
"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Eye, Users, Linkedin, Twitter } from "lucide-react";
import image1 from "@/components/images/Jayesh.jpg";
import image2 from "@/components/images/Vidushi.jpeg";
import image3 from "@/components/images/Kritika.jpeg"


const teamMembers = [
  {
    nameKey: "Jayesh Kumar Singh",
    email: "jayeshkumarsingh11@gmail.com",
    image: image1,
    linkedin: "https://www.linkedin.com/in/jayesh-singh-510953304/",
    x : "https://x.com/Jayeshs74820705",
  },
  {
    nameKey: "Vidushi Srivastava",
    email: "vidushi.official1012@gmail.com",
    image: image2,
    linkedin: "https://www.linkedin.com/in/srivastava-vidushi/",
    x:"https://x.com/Vidushi1012",
  },
  {
    nameKey: "Kritika Singh",
    email: "kritikasince2005@gmail.com",
    image: image3,
    linkedin: "",
    x: "",
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
          src="https://images.yourstory.com/cs/5/f02aced0d86311e98e0865c1f0fe59a2/indian-farmer-1610471656527.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <Card className="text-center h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-primary">
                <CardContent className="flex flex-col items-center p-6">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-accent transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage
                      src={typeof member.image === 'string' ? member.image : member.image.src}
                      alt={t(member.nameKey)}
                      width={100}
                      height={100}
                      data-ai-hint="person"
                    />
                    <AvatarFallback>{member.nameKey.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold font-headline">
                    {t(member.nameKey)}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <p>{t(member.email)}</p>
                  </div>
                  <div className="flex space-x-4 pt-4">
                  <a href={member.x} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter /></a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin /></a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
