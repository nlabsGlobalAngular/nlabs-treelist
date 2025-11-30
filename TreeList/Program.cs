
namespace TreeList;

using TreeList.Models;
using Microsoft.AspNetCore.Mvc;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }


        app.UseHttpsRedirection();
        app.UseCors();

        // Rastgele görsel URL'leri için helper metod
        static string GetRandomImageUrl(int seed)
        {
            var imageUrls = new[]
            {
                "https://picsum.photos/200/200?random=1",
                "https://picsum.photos/200/200?random=2",
                "https://picsum.photos/200/200?random=3",
                "https://picsum.photos/200/200?random=4",
                "https://picsum.photos/200/200?random=5",
                "https://picsum.photos/200/200?random=6",
                "https://picsum.photos/200/200?random=7",
                "https://picsum.photos/200/200?random=8",
                "https://picsum.photos/200/200?random=9",
                "https://picsum.photos/200/200?random=10",
                "https://i.pravatar.cc/200?img=1",
                "https://i.pravatar.cc/200?img=2",
                "https://i.pravatar.cc/200?img=3",
                "https://i.pravatar.cc/200?img=4",
                "https://i.pravatar.cc/200?img=5",
                "https://i.pravatar.cc/200?img=6",
                "https://i.pravatar.cc/200?img=7",
                "https://i.pravatar.cc/200?img=8",
                "https://avatars.dicebear.com/api/avataaars/seed" + seed + ".svg",
                "https://avatars.dicebear.com/api/bottts/seed" + seed + ".svg",
                "https://source.unsplash.com/200x200/?building,office&sig=" + seed,
                "https://source.unsplash.com/200x200/?company,business&sig=" + seed,
                "https://source.unsplash.com/200x200/?corporate,tech&sig=" + seed,
                "https://source.unsplash.com/200x200/?architecture,modern&sig=" + seed,
                "https://source.unsplash.com/200x200/?office,workspace&sig=" + seed
            };
            return imageUrls[seed % imageUrls.Length];
        }

        // Dummy data
        // Hiyerarşik 25 dummy organizasyon verisi
        var organizasyonlar = new List<Organizasyon>();

        // 3 ana üst organizasyon
        var root1 = new Organizasyon
        {
            Id = Guid.NewGuid(),
            Name = "Türk Telekom Holding",
            UstOrganizasyonMu = true,
            GorselUrl = GetRandomImageUrl(1),
            UstOrganizasyonId = null,
            UstOrganizasyon = null
        };
        var root2 = new Organizasyon
        {
            Id = Guid.NewGuid(),
            Name = "Koç Holding",
            UstOrganizasyonMu = true,
            GorselUrl = GetRandomImageUrl(2),
            UstOrganizasyonId = null,
            UstOrganizasyon = null
        };
        var root3 = new Organizasyon
        {
            Id = Guid.NewGuid(),
            Name = "Sabancı Holding",
            UstOrganizasyonMu = true,
            GorselUrl = GetRandomImageUrl(3),
            UstOrganizasyonId = null,
            UstOrganizasyon = null
        };
        organizasyonlar.AddRange(new[] { root1, root2, root3 });

        // root1 altına 3 seviye hiyerarşi
        var r1_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Türk Telekom A.Ş.", GorselUrl = GetRandomImageUrl(4), UstOrganizasyonMu = false, UstOrganizasyonId = root1.Id, UstOrganizasyon = null };
        var r1_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "TTNET A.Ş.", GorselUrl = GetRandomImageUrl(5), UstOrganizasyonMu = false, UstOrganizasyonId = root1.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r1_1, r1_2 });
        var r1_1_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Türk Telekom İstanbul Bölge Müdürlüğü", GorselUrl = GetRandomImageUrl(6), UstOrganizasyonMu = false, UstOrganizasyonId = r1_1.Id, UstOrganizasyon = null };
        var r1_1_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Türk Telekom Ankara Bölge Müdürlüğü", GorselUrl = GetRandomImageUrl(7), UstOrganizasyonMu = false, UstOrganizasyonId = r1_1.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r1_1_1, r1_1_2 });
        var r1_1_2_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Ankara Çankaya Şubesi", GorselUrl = GetRandomImageUrl(8), UstOrganizasyonMu = false, UstOrganizasyonId = r1_1_2.Id, UstOrganizasyon = null };
        organizasyonlar.Add(r1_1_2_1);

        // root2 altına 2 seviye hiyerarşi
        var r2_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Arçelik A.Ş.", GorselUrl = GetRandomImageUrl(9), UstOrganizasyonMu = false, UstOrganizasyonId = root2.Id, UstOrganizasyon = null };
        var r2_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Ford Otosan", GorselUrl = GetRandomImageUrl(10), UstOrganizasyonMu = false, UstOrganizasyonId = root2.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r2_1, r2_2 });
        var r2_1_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Arçelik Üretim Tesisleri", GorselUrl = GetRandomImageUrl(11), UstOrganizasyonMu = false, UstOrganizasyonId = r2_1.Id, UstOrganizasyon = null };
        var r2_1_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Arçelik Pazarlama Müdürlüğü", GorselUrl = GetRandomImageUrl(12), UstOrganizasyonMu = false, UstOrganizasyonId = r2_1.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r2_1_1, r2_1_2 });

        // root3 altına 4 seviye hiyerarşi
        var r3_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Akbank T.A.Ş.", GorselUrl = GetRandomImageUrl(13), UstOrganizasyonMu = false, UstOrganizasyonId = root3.Id, UstOrganizasyon = null };
        var r3_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Enerjisa Enerji A.Ş.", GorselUrl = GetRandomImageUrl(14), UstOrganizasyonMu = false, UstOrganizasyonId = root3.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r3_1, r3_2 });
        var r3_1_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Akbank Kurumsal Bankacılık", GorselUrl = GetRandomImageUrl(15), UstOrganizasyonMu = false, UstOrganizasyonId = r3_1.Id, UstOrganizasyon = null };
        var r3_1_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Akbank Bireysel Bankacılık", GorselUrl = GetRandomImageUrl(16), UstOrganizasyonMu = false, UstOrganizasyonId = r3_1.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r3_1_1, r3_1_2 });
        var r3_1_1_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Kurumsal Bankacılık İstanbul", GorselUrl = GetRandomImageUrl(17), UstOrganizasyonMu = false, UstOrganizasyonId = r3_1_1.Id, UstOrganizasyon = null };
        var r3_1_1_2 = new Organizasyon { Id = Guid.NewGuid(), Name = "Kurumsal Bankacılık Ankara", GorselUrl = GetRandomImageUrl(18), UstOrganizasyonMu = false, UstOrganizasyonId = r3_1_1.Id, UstOrganizasyon = null };
        organizasyonlar.AddRange(new[] { r3_1_1_1, r3_1_1_2 });
        var r3_1_1_2_1 = new Organizasyon { Id = Guid.NewGuid(), Name = "Ankara Kızılay Kurumsal Şubesi", GorselUrl = GetRandomImageUrl(19), UstOrganizasyonMu = false, UstOrganizasyonId = r3_1_1_2.Id, UstOrganizasyon = null };
        organizasyonlar.Add(r3_1_1_2_1);

        // Ek olarak, toplamı 25'e tamamlamak için düz seviye alt organizasyonlar ekle
        var extraOrgs = new[]
        {
            new { Parent = r2_2, Name = "Ford Otosan Kocaeli Fabrikası" },
            new { Parent = r2_2, Name = "Ford Otosan Gölcük Fabrikası" },
            new { Parent = r3_2, Name = "Enerjisa İstanbul Elektrik Dağıtım" },
            new { Parent = r3_2, Name = "Enerjisa Başkent Elektrik Dağıtım" },
            new { Parent = r1_2, Name = "TTNET Müşteri Hizmetleri" },
            new { Parent = r3_1_2, Name = "Bireysel Bankacılık İstanbul Bölge Müdürlüğü" }
        };

        int extraCounter = 20;
        foreach (var extra in extraOrgs)
        {
            if (organizasyonlar.Count >= 25) break;
            organizasyonlar.Add(new Organizasyon
            {
                Id = Guid.NewGuid(),
                Name = extra.Name,
                GorselUrl = GetRandomImageUrl(extraCounter++),
                UstOrganizasyonMu = false,
                UstOrganizasyonId = extra.Parent.Id,
                UstOrganizasyon = null
            });
        }

        // Özel string endpointler önce tanımlanmalı
        app.MapGet("/organizasyon/ust", () =>
            organizasyonlar.Where(x => x.UstOrganizasyonMu).ToList())
            .WithName("GetUstOrganizasyonlar");

        app.MapGet("/organizasyon/alt/{ustId}", ([FromRoute] Guid ustId) =>
            organizasyonlar.Where(x => x.UstOrganizasyonId == ustId).ToList())
            .WithName("GetAltOrganizasyonlar");

        app.MapGet("/organizasyon", () => organizasyonlar)
            .WithName("GetAllOrganizasyon");

        // Guid parametreli endpointler en sonda
        app.MapGet("/organizasyon/{id:guid}", ([FromRoute] Guid id) =>
        {
            var org = organizasyonlar.FirstOrDefault(x => x.Id == id);
            return org is not null ? Results.Ok(org) : Results.NotFound();
        })
            .WithName("GetOrganizasyonById");

        app.MapPost("/organizasyon", ([FromBody] Organizasyon org) =>
{
    org.Id = Guid.NewGuid();
    organizasyonlar.Add(org);
    return Results.Created($"/organizasyon/{org.Id}", org);
})
    .WithName("CreateOrganizasyon");

app.MapPut("/organizasyon/{id}", ([FromRoute] Guid id, [FromBody] Organizasyon updatedOrg) =>
{
    var org = organizasyonlar.FirstOrDefault(x => x.Id == id);
    if (org is null) return Results.NotFound();
    org.Name = updatedOrg.Name;
    org.GorselUrl = updatedOrg.GorselUrl;
    org.UstOrganizasyonMu = updatedOrg.UstOrganizasyonMu;
    org.UstOrganizasyonId = updatedOrg.UstOrganizasyonId;
    org.UstOrganizasyon = updatedOrg.UstOrganizasyon;
    return Results.Ok(org);
})
    .WithName("UpdateOrganizasyon");

app.MapDelete("/organizasyon/{id}", ([FromRoute] Guid id) =>
{
    var org = organizasyonlar.FirstOrDefault(x => x.Id == id);
    if (org is null) return Results.NotFound();
    organizasyonlar.Remove(org);
    return Results.NoContent();
})
    .WithName("DeleteOrganizasyon");

        app.Run();
    }
}
