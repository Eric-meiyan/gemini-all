"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

interface AboutContentProps {
  locale: string;
}

export default function AboutContent({ locale }: AboutContentProps) {
  const t = useTranslations();

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      avatar: "/imgs/users/sarah-johnson.png",
      bio: "Full-stack developer with 8+ years experience in AI and CLI tools.",
      github: "https://github.com/sarah-johnson",
      twitter: "https://twitter.com/sarah_dev"
    },
    {
      name: "Alex Chen",
      role: "Community Manager",
      avatar: "/imgs/users/alex-chen.png",
      bio: "Passionate about building developer communities and open source.",
      github: "https://github.com/alex-chen",
      twitter: "https://twitter.com/alex_community"
    }
  ];

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">{t("about.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("about.description")}
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t("about.mission.title")}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="RiLightbulbLine" className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">{t("about.mission.innovate.title")}</h3>
              <p className="text-muted-foreground">{t("about.mission.innovate.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="RiTeamLine" className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">{t("about.mission.community.title")}</h3>
              <p className="text-muted-foreground">{t("about.mission.community.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="RiRocketLine" className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">{t("about.mission.empower.title")}</h3>
              <p className="text-muted-foreground">{t("about.mission.empower.description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t("about.team.title")}</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={member.github} target="_blank">
                      <Icon name="RiGithubLine" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={member.twitter} target="_blank">
                      <Icon name="RiTwitterLine" className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">{t("about.contact.title")}</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("about.contact.description")}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="mailto:hello@geminicli.dev">
              <Icon name="RiMailLine" className="h-4 w-4 mr-2" />
              {t("about.contact.email")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
                            <Link href="https://github.com/geminicli" target="_blank">
              <Icon name="RiGithubLine" className="h-4 w-4 mr-2" />
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
